var Items = [];
var Item = Class.extend({
	init: function(name, type, ofType, supclass, material){
		this.name = name;
		this.type = type;
		this.ofType = ofType;
		this.supclass = supclass;
		this.material = material;
		Items.push(this);
	}
});