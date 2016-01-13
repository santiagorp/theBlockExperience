// Publications here.
//
// Example:
// Meteor.publish('images-by-id', function(imageId) {
//   return Images.find({
//       _id: imageId
//     });
// });

Meteor.publish('latestBlocks', function() {
  var result = BlockIndexes.find({}, { sort: { h: -1 }, limit: 15 });
  return result;
});
