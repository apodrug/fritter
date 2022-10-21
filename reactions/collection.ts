import type {HydratedDocument, Types} from 'mongoose';
import type {Reaction} from './model';
import ReactionModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class ReactCollection {
  /**
   * Add a reaction to the collection
   *
   * @param {string} reactionType - The type of reaction
   * @param {string} userId - The id of the user of the reaction
   * @param {string} freet - The id of the of the freet
   * @return {Promise<HydratedDocument<Like>>} - The newly created reaction
   */
  static async addOne(reactionType: string, userId: Types.ObjectId | string, freet: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    console.log('inCollection');
    const recommended = 0;
    const reaction = new ReactionModel({
      userId,
      freetId: freet,
      reactionType,
      recommended
    });
    await reaction.save(); // Saves reactions to MongoDB
    return reaction.populate('userId');
  }

  /**
   * Find a reaction by reactionId
   *
   * @param {string} reactionId - The id of the reaction to find
   * @return {Promise<HydratedDocument<Reaction>> | Promise<null> } - The reaction with the given reactionId, if any
   */
  static async findOne(reactionId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    return ReactionModel.findOne({_id: reactionId}).populate('userId');
  }

  /**
   * Get all the reactions in the database
   *
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findAll(): Promise<Array<HydratedDocument<Reaction>>> {
    // Retrieves freets and sorts them from most to least recent
    return ReactionModel.find({}).sort({dateModified: -1}).populate('userId');
  }

  /**
   * Get all the reactions by given user
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Reaction>>> {
    const author = await UserCollection.findOneByUsername(username);
    return ReactionModel.find({userId: author._id}).populate('userId');
  }

  /**
   * Get all the reactions of a freet
   *
   * @param {string} freet - The id of a freet
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the freets
   */
  static async findAllByFreet(freet: Types.ObjectId | string): Promise<Array<HydratedDocument<Reaction>>> {
    return ReactionModel.find({freetId: freet}).populate('userId');
  }

  /**
   * Remove a reaction with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(reactId: Types.ObjectId | string): Promise<boolean> {
    const reaction = await ReactionModel.deleteOne({_id: reactId});
    return reaction !== null;
  }

  /**
   * Delete all the reactions by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteMany({authorId});
  }
}

export default ReactCollection;
