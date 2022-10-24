import type {HydratedDocument, Types} from 'mongoose';
import type {Reaction} from './model';
import type {Freet} from '../freet/model';
import ReactionModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import FreetModel from 'freet/model';

/**
 * This files contains a class that has the functionality to explore reactions
 * stored in MongoDB, including adding, finding, and deleting reactions.
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
    let recommended = 1;
    if (reactionType === 'sad') {
      recommended = 0;
    }

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
    // Retrieves reacts and sorts them from most to least recent
    return ReactionModel.find({}).sort({dateModified: -1}).populate('userId');
  }

  /**
   * Get all the reactions by given user
   *
   * @param {string} username - The username of author of the reactions
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Reaction>>> {
    const author = await UserCollection.findOneByUsername(username);
    return ReactionModel.find({userId: author._id}).populate('userId');
  }

  /**
   * Get all the reactions of a freet
   *
   * @param {string} freet - The id of a freet
   * @return {Promise<HydratedDocument<Reaction>[]>} - An array of all of the reactions
   */
  static async findAllByFreet(freet: Types.ObjectId | string): Promise<Array<HydratedDocument<Reaction>>> {
    return ReactionModel.find({freetId: freet}).populate('userId');
  }

  /**
   * Remove a reaction with given reactionId.
   *
   * @param {string} freetId - The reactionId of reaction to delete
   * @return {Promise<Boolean>} - true if the reaction has been deleted, false otherwise
   */
  static async deleteOne(reactId: Types.ObjectId | string): Promise<boolean> {
    const reaction = await ReactionModel.deleteOne({_id: reactId});
    return reaction !== null;
  }

  /**
   * Delete all the reactions by the given author
   *
   * @param {string} authorId - The id of author of reactions
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteMany({authorId});
  }

  /**
   * Get all freets sorted by recommended
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the reactions
   */
  static async sortFreetsByRecommended(): Promise<Array<HydratedDocument<Freet>>> {
    const recommendedFreets: any = {};
    const freets = await FreetCollection.findAll(); //get all freets unordered
    freets.forEach(dict => recommendedFreets[dict._id.toString()]=0); //make dict of freet, var of how many recommended reactions the freet has (initialized to 0)
    const reactions = await ReactCollection.findAll(); //get all reactions
    reactions.forEach(dict => recommendedFreets[dict.freetId.toString()]+=dict.recommended); //for each reaction, add the recommended var(if its boosting post: 1,0,-1) to freet dict

    let recommendedFreetsEntries: [string, number][] = Object.entries(recommendedFreets); //change dictionary to list so we can sort
    
    let sortedEntries = recommendedFreetsEntries.sort(([, a], [, b]) => b - a); //sort previous dict by recommended var
    
    let sortedFreetObjs: any = [];

    for (var [freetId,val] of sortedEntries){ //make list of just freet objects using the sorted list of freet Ids
      sortedFreetObjs.push(await FreetCollection.findOne(freetId))
    }

    return sortedFreetObjs;
  
    }

  /**
   * Updates a negative reaction's recommended variable
   *
   * @param {string} reactionId - The id of the reaction to find
   * @return {Promise<HydratedDocument<Reaction>> | Promise<null> } - The reaction with the given reactionId, if any
   */
  static async updateReactionRecommended(reactionId: Types.ObjectId | string, recommended: string): Promise<HydratedDocument<Reaction>> {
    const reaction = await ReactionModel.findOne({_id: reactionId}).populate('userId');
    if (recommended === 'yes'){
      reaction.recommended = 1;
    } else { //recommended == no
      reaction.recommended = -1;
    };
    await reaction.save();
    return reaction.populate('userId');
  }
}

export default ReactCollection;
