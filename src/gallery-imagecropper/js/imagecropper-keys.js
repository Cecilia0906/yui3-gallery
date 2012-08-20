function ImageCropperKeys(config) {
	this._handle = config.host.after('render', this._plugAll, this);
}
ImageCropperKeys.NS = 'keys';

ImageCropperKeys.prototype._plugAll = function () {
	this.drag.plug(Y.Plugin.DDKeys);
};
ImageCropperKeys.prototype.destroy = function () {
	this._handle.detach();
	this._handle = null;
};