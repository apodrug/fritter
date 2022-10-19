import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReactCollection from '../freet/collection';

/**
 * Checks if a reaction with reactionId is req.params exists
 */
const isReactionExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.reactionId);
  const reaction = validFormat ? await ReactCollection.findOne(req.params.reactionId) : '';
  if (!reaction) {
    res.status(404).json({
      error: {
        freetNotFound: `Reaction with Reaction ID ${req.params.reactionId} does not exist.`
      }
    });
    return;
  }

  next();
};
