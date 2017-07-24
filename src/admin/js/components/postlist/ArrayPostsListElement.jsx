import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import Checkbox from 'material-ui/Checkbox';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

export default class ArrayPostsListElement extends React.Component{
	constructor(props){
		super(props);
		// Object.keys(this).forEach(index=>{if(React.Component[index]==undefined && this[index] instanceof Function){this[index] = this[index].bind(this);}});
		this.state = {expanded:false,excerpt:true,newtab:false};
	}

	handleExpandChange = (expanded)=>{this.setState({expanded: expanded});}
	handleExcerptCheck = (event,isChecked)=>{this.setState({excerpt: isChecked});}
	handleNewTabCheck = (event,isChecked)=>{this.setState({newtab: isChecked});}

	render(){
			let post = this.props.post;

			return (
				<Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange} className="postsListElement">
					<CardHeader
					  title={post.title.rendered}
					  avatar={post.featured_media? this.props.images[post.featured_media].media_details.sizes.thumbnail.source_url : null}
					  actAsExpander={true}
					  showExpandableButton={false}
					  className = "postsListElement-header"
					/>
					<CardText expandable={true}>
						<Checkbox label="Include excerpt" checked={this.state.excerpt} onCheck={this.handleExcerptCheck} />
						<Checkbox label="Link opens on new page" checked={this.state.newtab}  onCheck={this.handleNewTabCheck}  />
						<RaisedButton className="btn-add" label="Add" />
					</CardText>
				</Card>

			);
	}
}