import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import StatusCollection from './collection';
import * as userValidator from '../user/middleware';
import * as statusValidator from '../status/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the statuses
 *
 * @name GET /api/statuses
 *
 * @return {StatusResponse[]} - A list of all the statuses sorted in descending
 *                      order by date modified
 */
/**
 * Get statuses by author.
 *
 * @name GET /api/statuses?authorId=id
 *
 * @return {ReactResponse[]} - An array of statuses created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
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

    const allStatuses = await StatusCollection.findAll();
    const response = allStatuses.map(util.constructStatusResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorStatus = await StatusCollection.findAllByUsername(req.query.author as string);
    const response = authorStatus.map(util.constructStatusResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new status.
 *
 * @name POST /api/statuses
 *
 * @param {string} content - The content of the status
 * @return {FreetResponse} - The created status
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the status content is empty or a stream of empty spaces
 * @throws {413} - If the status content is more than 30 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    statusValidator.isValidStatusContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await StatusCollection.addOne(userId, req.body.content);

    res.status(201).json({
      message: 'Your status was created successfully.',
      freet: util.constructStatusResponse(freet)
    });
  }
);

/**
 * Delete a status
 *
 * @name DELETE /api/statuses/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the status
 * @throws {404} - If the statusId is not valid
 */
router.delete(
  '/:id?',
  [
    userValidator.isUserLoggedIn,
    statusValidator.isStatusExists,
    statusValidator.isValidStatusModifier
  ],
  async (req: Request, res: Response) => {
    await StatusCollection.deleteOne(req.params.id);
    res.status(200).json({
      message: 'Your status was deleted successfully.'
    });
  }
);

export {router as statusRouter};
