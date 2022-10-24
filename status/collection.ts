import type {HydratedDocument, Types} from 'mongoose';
import type {Status} from './model';
import StatusModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore statuses
 * stored in MongoDB, including adding, finding, updating, and deleting statuses.
 * Feel free to add additional operations in this file.
 * 
 */
class StatusCollection {
  /**
   * Add a status to the collection
   *
   * @param {string} authorId - The id of the author of the status
   * @param {string} content - The id of the content of the status
   * @return {Promise<HydratedDocument<Status>>} - The newly created status
   */
  static async addOne(authorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Status>> {
    const date = new Date();
    await StatusCollection.deleteMany(authorId);
    const status = new StatusModel({
      authorId,
      dateCreated: date,
      content
    });
    await status.save(); // Saves status to MongoDB
    return status.populate('authorId');
  }

  /**
   * Find a status by statusId
   *
   * @param {string} statusId - The id of the status to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The status with the given statusId, if any
   */
  static async findOne(statusId: Types.ObjectId | string): Promise<HydratedDocument<Status>> {
    return StatusModel.findOne({_id: statusId}).populate('authorId');
  }

  /**
   * Get all the statuses in the database
   *
   * @return {Promise<HydratedDocument<Status>[]>} - An array of all of the statuses
   */
  static async findAll(): Promise<Array<HydratedDocument<Status>>> {
    // Retrieves freets and sorts them from most to least recent
    return StatusModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the statuses in by given author
   *
   * @param {string} username - The username of author of the statuses
   * @return {Promise<HydratedDocument<Status>[]>} - An array of all of the statuses
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Status>>> {
    const author = await UserCollection.findOneByUsername(username);
    return StatusModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Delete a status with given statusId.
   *
   * @param {string} statusId - The statusId of status to delete
   * @return {Promise<Boolean>} - true if the status has been deleted, false otherwise
   */
  static async deleteOne(statusId: Types.ObjectId | string): Promise<boolean> {
    const status = await StatusModel.deleteOne({_id: statusId});
    return status !== null;
  }

  /**
   * Delete all the statuses by the given author
   *
   * @param {string} authorId - The id of author of statuses
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await StatusModel.deleteMany({authorId});
  }
}

export default StatusCollection;
