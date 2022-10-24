import type {HydratedDocument, Types} from 'mongoose';
import type {Bookmark} from './model';
import BookmarkModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore bookmarks
 * stored in MongoDB, including adding, finding, and deleting bookmarks(and their freets).
 *
 */
class BookmarkCollection {
  /**
   * Add a bookmark to the collection
   *
   * @param {string} userId - The id of the user of the bookmark
   * @param {string} freet - The id of the freet
   * @return {Promise<HydratedDocument<Bookmark>>} - The newly created bookmark
   */
  static async addOne(userId: Types.ObjectId | string, freet: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    const bookmark = new BookmarkModel({
      userId,
      freetId: freet
    });
    await bookmark.save(); // Saves bookmarks to MongoDB
    return bookmark.populate('userId');
  }

  /**
   * Find a bookmark by bookmarkId
   *
   * @param {string} bookmarkId - The id of the bookmark to find
   * @return {Promise<HydratedDocument<Bookmark>> | Promise<null> } - The bookmark with the given bookmarkId, if any
   */
  static async findOne(bookmarkId: Types.ObjectId | string): Promise<HydratedDocument<Bookmark>> {
    return BookmarkModel.findOne({_id: bookmarkId}).populate('userId');
  }

  /**
   * Get all the bookmarks in the database
   *
   * @return {Promise<HydratedDocument<Bookmark>[]>} - An array of all of the bookmarks
   */
  static async findAll(): Promise<Array<HydratedDocument<Bookmark>>> {
    // Retrieves reacts and sorts them from most to least recent
    return BookmarkModel.find({}).sort({dateModified: -1}).populate('userId');
  }

  /**
   * Get all the bookmarks by given user
   *
   * @param {string} username - The username of author of the bookmarks
   * @return {Promise<HydratedDocument<Bookmarks>[]>} - An array of all of the bookmarks
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Bookmark>>> {
    const author = await UserCollection.findOneByUsername(username);
    return BookmarkModel.find({userId: author._id}).populate('userId');
  }

  /**
   * Remove a bookmark with given bookmarkId.
   *
   * @param {string} bookmarkId - The bookmarkId of bookmark to delete
   * @return {Promise<Boolean>} - true if the bookmark has been deleted, false otherwise
   */
  static async deleteOne(bookmarkId: Types.ObjectId | string): Promise<boolean> {
    const bookmark = await BookmarkModel.deleteOne({_id: bookmarkId});
    return bookmark !== null;
  }

  /**
   * Delete all the bookmarks by the given author
   *
   * @param {string} bookmarkId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await BookmarkModel.deleteMany({authorId});
  }
}

export default BookmarkCollection;
