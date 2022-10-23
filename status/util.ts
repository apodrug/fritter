import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Status, PopulatedStatus} from '../status/model';

// Update this if you add a property to the Freet type!
type StatusResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Status object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Status>} freet - A status
 * @returns {StatusResponse} - The status object formatted for the frontend
 */
const constructStatusResponse = (status: HydratedDocument<Status>): StatusResponse => {
  const statusCopy: PopulatedStatus = {
    ...status.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = statusCopy.authorId;
  delete statusCopy.authorId;
  return {
    ...statusCopy,
    _id: statusCopy._id.toString(),
    author: username,
    dateCreated: formatDate(status.dateCreated)
  };
};

export {
  constructStatusResponse
};
