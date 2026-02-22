export interface MongoId {
  $oid: string;
}

export interface MongoNumberInt {
  $numberInt: string;
}

export interface RawArticle {
  _id: MongoId;
  title: string;
  body: string;
  image: string;
  category: string;
  authorName: string;
  date: string | number; // timestamp as string/number
  userid: MongoId;
  __v: MongoNumberInt;
}

export interface Article {
  id: string;
  title: string;
  body: string;
  image: string;
  category: string;
  authorName: string;
  date: Date;
  userId: string;
  version: number;
}

export function mapRawArticle(a: RawArticle): Article {
  return {
    id: a._id.$oid,
    title: a.title,
    body: a.body,
    image: a.image,
    category: a.category,
    authorName: a.authorName,
    date: new Date(Number(a.date)), // safe conversion
    userId: a.userid.$oid,
    version: Number(a.__v.$numberInt),
  };
}
