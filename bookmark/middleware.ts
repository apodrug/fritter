import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import {stringify} from 'uuid';
import BookmarkCollection from '../bookmark/collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a bookmark with id in req.params exists
 */
const isBookmarkExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.id);
  const bookmark = validFormat ? await BookmarkCollection.findOne(req.params.id) : '';
  if (!bookmark) {
    res.status(404).json({
      error: {
        freetNotFound: `Bookmark with ID ${req.params.id} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId in req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.query)
  const validFormat = Types.ObjectId.isValid(req.query.freetId as string);
  console.log(validFormat)
  const freet = validFormat ? await FreetCollection.findOne(req.query.freetId as string) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.query.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId as author id in req.query exists
 */
const isUserExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.user) {
    res.status(400).json({
      error: 'Provided username must be nonempty.'
    });
  }
};


/**
 * Checks if the current user is the author of the bookmark whose bookmark id is in req.params
 */
const isValidBookmarkModifier = async (req: Request, res: Response, next: NextFunction) => {
  const bookmark = await BookmarkCollection.findOne(req.params.id);
  const userId = bookmark.userId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' bookmarks.'
    });
    return;
  }

  next();
};

export {
  isFreetExists,
  isUserExists,
  isBookmarkExists,
  isValidBookmarkModifier
};
