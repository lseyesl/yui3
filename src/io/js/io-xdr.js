   /**
    * Extends the IO base class to provide an alternate, Flash transport, for making
    * cross-domain requests.
	* @module io
	* @submodule io-xdr
	*/

   /**
	* @event io:xdrReady
	* @description This event is fired by YUI.io when the specified transport is
	* ready for use.
	* @type Event Custom
	*/
	var E_XDR_READY = 'io:xdrReady';

   /**
	* @description Method that creates the Flash transport swf.
	*
	* @method _swf
	* @private
	* @static
	* @param {string} uri - location of IO.swf.
	* @param {string} yid - YUI instance id.
	* @return void
	*/
	function _swf(uri, yid) {
		var XDR_SWF = '<object id="yuiIoSwf" type="application/x-shockwave-flash" data="' +
		              uri + '" width="0" height="0">' +
		     		  '<param name="movie" value="' + uri + '">' +
		     		  '<param name="FlashVars" value="yid=' + yid + '">' +
                      '<param name="allowScriptAccess" value="sameDomain">' +
		    	      '</object>';
		Y.get('body').appendChild(Y.Node.create(XDR_SWF));
	};

    Y.mix(Y.io, {

	   /**
		* @description Map of IO transports.
		*
		* @property _transport
		* @private
		* @static
		* @type object
		*/
		_transport: {},

	   /**
		* @description Object that stores callback handlers for cross-domain requests
		* when using Flash as the transport.
		*
		* @property _fn
		* @private
		* @static
		* @type object
		*/
		_fn: {},

	   /**
	   	* @description Method for accessing the transport's interface for making a
	   	* cross-domain transaction.
	   	*
		* @method _xdr
		* @private
		* @static
		* @param {string} uri - qualified path to transaction resource.
    	* @param {object} o - Transaction object generated by _create() in io-base.
		* @param {object} c - configuration object for the transaction.
		* @return object
		*/
		_xdr: function(uri, o, c) {
			if (c.on) {
				this._fn[o.id] = c.on;
			}
			o.c.send(uri, c, o.id);

			return o;
		},


	   /**
		* @description Fires event "io:xdrReady"
		*
		* @method xdrReady
		* @private
		* @static
		* @param {number} id - transaction id
		* @param {object} c - configuration object for the transaction.
		*
		* @return void
		*/
		xdrReady: function(id) {
			Y.fire(E_XDR_READY, id);
		},

	   /**
		* @description Method to initialize the desired transport.
		*
		* @method transport
		* @public
		* @static
		* @param {object} o - object of transport configurations.
		* @return void
		*/
		transport: function(o) {
			switch (o.id) {
				case 'flash':
					_swf(o.src, o.yid);
					this._transport.flash = Y.config.doc.getElementById('yuiIoSwf');
					break;
			}
		}
	});