import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Bookmark, PopulatedBookmark} from '../bookmark/model';

type BookmarkResponse = {
  _id: string;
  user: string;
  freet: string;
};

/**
 * Transform a raw Bookmark object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Bookmark>} bookmark - A bookmark
 * @returns {BookmarkResponse} - The bookmark object formatted for the frontend
 */
const constructBookmarkResponse = (bookmark: HydratedDocument<Bookmark>): BookmarkResponse => {
  const bookmarkCopy: PopulatedBookmark = {
    ...bookmark.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = bookmarkCopy.userId;
  delete bookmarkCopy.userId;
  return {
    // ...reactCopy,
    _id: bookmarkCopy._id.toString(),
    user: username,
    freet: bookmarkCopy.freetId._id.toString()
  };
};

export {
  constructBookmarkResponse
};
