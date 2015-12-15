// Publications here.
//
// Example:
// Meteor.publish('images-by-id', function(imageId) {
//   return Images.find({
//       _id: imageId
//     });
// });

Meteor.publish('latestBlocks', function() {
  return LatestBlocks.find();
});

Meteor.publish('blockIndexes', function() {
  return BlockIndexes.find();
});
