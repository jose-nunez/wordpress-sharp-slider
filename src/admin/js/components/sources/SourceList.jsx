import React from 'react';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';

import SlideShowController from 'slideShowController';
import SharpSlideShow_API from 'sharpSlideShowAPI';
import SourceElement from 'sourceElement';
import 'sourceStyles';

export default class SourceList extends React.Component{
	constructor(props){
		super(props);
	}

	extractParams ={
		page: page=>this.extractParams['post'](page,'page'),
		post: (post,type='post')=>{
			let img = null;
			let imgobj,img_sizes;
			if(post.featured_media && (imgobj = this.props.sources.images[post.featured_media]) ){ 
				if(img_sizes = imgobj.media_details.sizes){
					img = img_sizes.thumbnail.source_url;
				}
				else if(imgobj.source_url){
					img = imgobj.source_url;
				}
			}
			return {
					title:post.title.rendered,
					img_url:img,
					source_type:type,
					source_id:''+post.id,
					settings:{},
					link:post.link,
					caption:post.excerpt.rendered
				};
		},
		slide:slide=>slide,
	}

	addSlide = (slide)=>{
		return SharpSlideShow_API.addSlide(this.props.slideShowID,slide).then(
			resp=>{SlideShowController.requestRefresh();console.log('refrescandola add',resp)},
			err=>{throw err;}
		);
	}
	updateSlide = (slide)=>{
		return SharpSlideShow_API.updateSlide(this.props.slideShowID,slide).then(
			resp=>{SlideShowController.requestRefresh();console.log('refrescandola update',resp)},
			err=>{throw err;}
		);
	}
	removeSlide = (slideID)=>{
		return SharpSlideShow_API.removeSlide(this.props.slideShowID,slideID).then(
			resp=>{if(resp.data)SlideShowController.requestRefresh();console.log('refrescandola delete',resp)},
			err=>{throw err;}
		);
	}

	render(){
		return (
			<List className="source-list">
				{this.props.sources[this.props.type].map((source,index)=>{
					return (
						<SourceElement 
							key={index} 
							type={this.props.type} 
							source={this.extractParams[this.props.type](source)} 
							addSlide={this.addSlide}
							updateSlide={this.updateSlide}
							removeSlide={this.removeSlide}
						/>
					);
				})}
			</List>
		);
	}
}
