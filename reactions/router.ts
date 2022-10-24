import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReactCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as reactValidator from '../reactions/middleware';
import * as util from './util';
import * as freetUtil from '../freet/util';

const router = express.Router();

/**
 * Get all the reactions
 *
 * @name GET /api/reactions
 *
 * @return {ReactResponse[]} - A list of all the reactions sorted in descending
 *                      order by date modified
 */
/**
 * Get all reactions a user has made.
 *
 * @name GET /api/reactions?author=USERNAME
 *
 * @return {ReactResponse[]} - An array of reacts created by user
 * @throws {400} - If username is not given
 * @throws {404} - If username is not recognizable
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    if (req.query.freetId !== undefined) {
      next('route');
      return;
    }

    const allReacts = await ReactCollection.findAll();
    const response = allReacts.map(util.constructReactResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorReacts = await ReactCollection.findAllByUsername(req.query.author as string);
    const response = authorReacts.map(util.constructReactResponse);
    res.status(200).json(response);
  }
);

/**
 * Get reactions of a freet.
 *
 * @name GET /api/reactions?freetId=id
 *
 * @return {ReactResponse[]} - An array of reacts of a freet
 * @throws {404} - If freetId is not valid
 *
 */
router.get(
  '/',
  [
    reactValidator.isFreetExistsRead
  ],
  async (req: Request, res: Response) => {
    const freetReacts = await ReactCollection.findAllByFreet(req.query.freetId as string);
    const response = freetReacts.map(util.constructReactResponse);
    res.status(200).json(response);
  }
);

/**
 * Get all freets sorted by recommended
 *
 * @name GET /api/reactions/freets
 *
 * @return {ReactResponse[]} - An array of freets sorted by their reaction recommended variable
 *
 */
 router.get(
  '/freets',
  async (req: Request, res: Response) => {
    const freetReacts = await ReactCollection.sortFreetsByRecommended();
    const response = freetReacts.map(freetUtil.constructFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new reaction.
 *
 * @name POST /api/reactions
 *
 * @return {ReactResponse} - The created reaction
 * @throws {403} - If the user is not logged in
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    reactValidator.isFreetExistsWrite
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const reaction = await ReactCollection.addOne(req.body.reactionType, userId, req.body.freetId);

    res.status(201).json({
      message: 'Your reaction was created successfully.',
      reaction: util.constructReactResponse(reaction)
    });
  }
);

/**
 * Delete a reaction
 *
 * @name DELETE /api/reacts/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the reactId is not valid
 */
router.delete(
  '/:id?',
  [
    userValidator.isUserLoggedIn,
    reactValidator.isReactExists,
    reactValidator.isValidReactModifier
  ],
  async (req: Request, res: Response) => {
    await ReactCollection.deleteOne(req.params.id);
    res.status(200).json({
      message: 'Your reaction was deleted successfully.'
    });
  }
);

/**
 * Modify whether a user recommends a post they reacted to (only applies to negative reactions)
 *
 * @name PUT /api/reactions/:id?recommended=number
 *
 * @param {freetId} content - the new content for the freet
 * @return {FreetResponse} - the updated freet
 * @throws {403} - if the user is not logged in or not the author of
 *                 of the freet
 * @throws {404} - If the freetId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
 router.put(
  '/:id?',
  [
    userValidator.isUserLoggedIn,
    reactValidator.isReactExists,
    reactValidator.isValidReactModifier,
  ],
  async (req: Request, res: Response) => {
    const reaction = await ReactCollection.updateReactionRecommended(req.params.id, req.query.recommended as string);
    res.status(200).json({
      message: 'Your reaction was updated successfully.',
      freet: util.constructReactResponse(reaction)
    });
  }
);

export {router as reactRouter};
