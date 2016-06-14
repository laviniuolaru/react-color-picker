'use strict'

var React  = require('react')
var ReactDOM = require('react-dom');
var Region = require('region')
var assign   = require('object-assign')
var common = require('./utils/common')

var VALIDATE = require('./utils/validate')

module.exports = React.createClass(assign({

    displayName: 'HueSpectrum',

    getDefaultProps: function(){
        return {
            height      : 300,
            width       : 30,
            pointerSize : 3,
            defaultColor: require('./defaultColor')
        }
    },

    getInitialState: function(){
        return {
            h: 0
        }
    },

    componentDidUpdate: function(){
        // this.updateDragPositionIf()
    },

    componentDidMount: function(){
        this.updateDragPositionIf()
    },

    updateDragPositionIf: function(){

        if (!this.props.height){
            this.setState({})
        }
    },

    render: function(){
        this.hsv = this.toColorValue(this.state.value || this.props.value || this.props.defaultValue || this.props.defaultColor)
        // console.log('hue:', this.hsv)

        if (this.state.h == 360 && !this.hsv.h){
            //in order to show bottom red as well on drag
            this.hsv.h = 360
        }

        var style = assign({}, this.props.style)

        if (this.props.height){
            style.height = this.props.height
        }
        if (this.props.width){
            style.width = this.props.width
        }

        var dragStyle = {
            height: this.props.pointerSize
        }

        var dragPos = this.getDragPosition()

        if (dragPos != null){
            dragStyle.top   = dragPos
            dragStyle.display = 'block'
        }
        return (
            <div className='react-color-picker__hue-spectrum' style={style} onMouseDown={this.onMouseDown}>
                <div className="react-color-picker__hue-drag" style={dragStyle}>
                    <div className="react-color-picker__hue-inner" />
                </div>
            </div>
        )
    },

    getDragPosition: function(hsv){
        hsv = hsv || this.hsv

        if (!this.props.height && !this.isMounted()){
            return null
        }

        var height = this.props.height || Region.fromDOM(ReactDOM.findDOMNode(this)).getHeight()
        var size   = this.props.pointerSize

        var pos  = Math.round(hsv.h * height / 360)
        var diff = Math.round(size / 2)

        return pos - diff
    },

    updateColor: function(point){
        point = VALIDATE(point)

        this.hsv.h = point.y * 360 / point.height
        
        // all colors on the hue slider have 1 as saturation and value,
        // so lets set the corresponding attributes to 1
        if (!this.hsv.s){
            this.hsv.s = 1;
        }
        if (!this.hsv.v){
            this.hsv.v = 1;
        }

        this.state.h = this.hsv.h != 0? this.hsv.h: 0
    },

    toStringValue: require('./utils/toStringValue')
}, common))
