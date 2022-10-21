import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReactCollection from '../freet/collection';
import FreetCollection from '../freet/collection';

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

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.body.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

export {
  isFreetExists
};
