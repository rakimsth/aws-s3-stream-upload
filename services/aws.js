const aws = require('aws-sdk');
const config = require('config');
// Configure client for use with Spaces
const s3 = new aws.S3({
  region: config.get('services.aws.region'),
  accessKeyId: config.get('services.aws.key'),
  secretAccessKey: config.get('services.aws.secret')
});

class AWS {
  constructor() {}

  // Create a new Space
  createBucket(bucket) {
    const bucketParams = {
      Bucket: bucket
    };
    return new Promise((resolve, reject) => {
      s3.createBucket(bucketParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve({ location: data.Location });
        }
      });
    });
  }

  // List all Buckets in the region
  listBuckets() {
    return new Promise((resolve, reject) => {
      s3.listBuckets({}, (err, data) => {
        const buckets = [];
        if (err) reject(err);
        else {
          const { Buckets } = data;
          Buckets.forEach(space => {
            const { Name } = space;
            buckets.push(Name);
          });
          resolve(buckets);
        }
      });
    });
  }

  // Add a file to a Space
  async sendFiletoAws({ payload, folder }) {
    const folderName = folder || config.get('services.aws.folder');

    const renamedFile = payload.filename.replace(/ /gi, '-');
    const params = {
      Body: payload.file,
      Bucket: config.get('services.aws.bucket'),
      Key: `${folderName}/${renamedFile}`,
      Tagging: `client=${folderName}`
    };
    const options = { partSize: 5 * 1024 * 1024, queueSize: 10 }; // 5MB
    return new Promise((resolve, reject) => {
      s3.upload(params, options, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  deleteFileFromAWS(key, bucketName) {
    // Sample Key: "test.jpg"
    const params = { Bucket: bucketName, Key: key };
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  // Get Presigned Url to give temporary access URL of any file
  getPresignedUrl({ bucketName, key, expiryTimeInSec }) {
    // Sample Key: "test.jpg"
    const params = {
      Bucket: bucketName || config.get('services.aws.bucket'),
      Key: key,
      Expires: expiryTimeInSec || 3600
    };
    return new Promise((resolve, reject) => {
      try {
        s3.getSignedUrl('getObject', params, (err, url) => {
          if (err) {
            reject(err);
          } else {
            resolve(url);
          }
        });
      } catch (e) {
        console.log(e);
      }
    });
  }

  // Revisit this later
  async listAllFilesOfBucketsFromAWS(bucketName, folderName) {
    let params = {
      Bucket: bucketName,
      Prefix: folderName
    };
    var files = [];
    return new Promise(resolve => {
      s3.listObjectsV2(params, function (err, data) {
        if (!err) {
          const sortedContent = data['Contents'].sort(
            (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
          );
          sortedContent.map(function (obj) {
            files.push(obj['Key']);
          });
          resolve(files);
        } else {
          console.log('err', err);
        }
      });
    });
  }
}

module.exports = new AWS();
