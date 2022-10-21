import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Reaction, PopulatedReaction} from '../reactions/model';

type ReactResponse = {
  _id: string;
  user: string;
  freet: string;
  reaction: string;
  postBoost: string;
};

/**
 * Transform a raw Reaction object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<React>} reaction - A reaction
 * @returns {FreetResponse} - The freet object formatted for the frontend
 */
const constructReactResponse = (react: HydratedDocument<Reaction>): ReactResponse => {
  const reactCopy: PopulatedReaction = {
    ...react.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = reactCopy.userId;
  delete reactCopy.userId;
  return {
    // ...reactCopy,
    _id: reactCopy._id.toString(),
    user: username,
    freet: reactCopy.freetId._id.toString(),
    reaction: reactCopy.reactionType.toString(),
    postBoost: reactCopy.recommended.toString()
  };
};

export {
  constructReactResponse
};
