var imageStore = new FS.Store.GridFS('images', {
  transformWrite: function(fileObj, readStream, writeStream) {
    // Default image settings
    var format = "jpg";
    var quality = 85;
    var name = "portrait." + format;
    var size = 512; // Width and Height
    var cropData = fileObj.metadata ? fileObj.metadata.cropData : {
      width: size,
      height: size,
      x: 0,
      y: 0
    };

    if (gm.isAvailable && cropData) {
      gm(readStream, name).crop(cropData.width, cropData.height, cropData.x, cropData.y)
        .resize(size).setFormat(format).quality(quality).stream().pipe(writeStream);
    } else {
      readStream.pipe(writeStream);
    }
  },
  beforeWrite: function(fileObj) {
    fileObj.extension('jpg', {store: "images", save: false});
    fileObj.type('image/jpg', {store: "images", save: false});
    fileObj.name('portrait.jpg', {store: "images", save: false});
  }
});

Images = new FS.Collection('images', {
  stores: [imageStore]
});

Images.deny({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function() {
    return false;
  },
  download: function() {
    return false;
  }
});

Images.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
  download: function() {
    return true;
  }
});
