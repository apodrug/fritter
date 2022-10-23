import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import StatusCollection from '../freet/collection';

/**
 * Checks if a status with statusId is req.params exists
 */
const isStatusExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.statusId);
  const status = validFormat ? await StatusCollection.findOne(req.params.statusId) : '';
  if (!status) {
    res.status(404).json({
      error: {
        freetNotFound: `Status with status ID ${req.params.statusId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidStatusContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Status content must be at least one character long.'
    });
    return;
  }

  if (content.length > 30) {
    res.status(413).json({
      error: 'Status content must be no more than 30 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidStatusModifier = async (req: Request, res: Response, next: NextFunction) => {
  const status = await StatusCollection.findOne(req.params.statusId);
  const statusId = status.authorId._id;
  if (req.session.userId !== statusId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' statuses.'
    });
    return;
  }

  next();
};

export {
  isValidStatusContent,
  isStatusExists,
  isValidStatusModifier
};
