import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import {stringify} from 'uuid';
import ReactCollection from '../reactions/collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a reaction with reactionId in req.params exists
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
 * Checks if a freet with freetId in body exists
 */
const isFreetExistsWrite = async (req: Request, res: Response, next: NextFunction) => {
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

/**
 * Checks if a freet with freetId in query exists
 */
const isFreetExistsRead = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.query.freetId as string);
  const freet = validFormat ? await FreetCollection.findOne(req.query.freetId as string) : '';
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
 * Checks if a reaction with react id in req.params exists
 */
const isReactExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.id);
  const react = validFormat ? await ReactCollection.findOne(req.params.id) : '';
  if (!react) {
    res.status(404).json({
      error: {
        freetNotFound: `Reaction with ID ${req.params.id} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the reaction whose id is in req.params
 */
const isValidReactModifier = async (req: Request, res: Response, next: NextFunction) => {
  const reaction = await ReactCollection.findOne(req.params.id);
  console.log(reaction);
  const userId = reaction.userId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' reactions.'
    });
    return;
  }

  next();
};

export {
  isFreetExistsWrite,
  isUserExists,
  isFreetExistsRead,
  isReactExists,
  isValidReactModifier
};
