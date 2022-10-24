import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Status
 * 
 */

// Type definition for Status on the backend
export type Status = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
};

export type PopulatedStatus = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Statuses stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const StatusSchema = new Schema<Status>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the status was created
  dateCreated: {
    type: Date,
    required: true,
  },
  // The content of the status
  content: {
    type: String,
    required: true
  }
});

const StatusModel = model<Status>('Status', StatusSchema);
export default StatusModel;
