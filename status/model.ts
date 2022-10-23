import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
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
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const StatusSchema = new Schema<Status>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  }
});

const StatusModel = model<Status>('Status', StatusSchema);
export default StatusModel;
