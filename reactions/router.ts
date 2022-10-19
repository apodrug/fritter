import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReactCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

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
 * @name GET /api/reactions?userId=id
 *
 * @return {ReactResponse[]} - An array of reacts created by user with id, userId
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given authorId
 *
 */
/**
 * Get reactions of a freet.
 *
 * @name GET /api/reactions?freetId=id
 *
 * @return {ReactResponse[]} - An array of reacts created by user with id, userId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no react has given freetId
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
  },
  [
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const freetReacts = await ReactCollection.findAllByFreet(req.query.freetId as string);
    const response = freetReacts.map(util.constructReactResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new reaction.
 *
 * @name POST /api/reactions
 *
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const reaction = await ReactCollection.addOne(userId, req.body);

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
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    await ReactCollection.deleteOne(req.params.reactId);
    res.status(200).json({
      message: 'Your reaction was deleted successfully.'
    });
  }
);

export {router as freetRouter};
