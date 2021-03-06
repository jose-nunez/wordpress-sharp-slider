import React from 'react';
import ReactPaginate from 'react-paginate';
import shortid  from 'shortid';

import indexArray from 'util';
import SourceList from 'sourceList';
import AppSettings from 'appSettings';
import SourcesLoader from 'sourcesLoader';
import SlideShowController from 'slideShowController';


export default class SourcesView extends React.Component{
	constructor(props) {
		super(props);

		this.state = {sources:[],pageCount:1,page: 1,isLoading:true,//loads on start
		};

		this.retrivingData=null;
	}
		
	componentWillUnmount = ()=>{
		SlideShowController.removeRefreshCallback(this.refreshData);
	}
	componentDidMount = ()=>{
		if(this.props.type=='slide') SlideShowController.addRefreshCallback(this.refreshData); // In case the slideshow was updated
		this.refreshData();
	}
	componentWillReceiveProps = (nextProps)=>{
		let type = nextProps.type;
		if(type && this.shouldRefreshData[type](nextProps)){
			this.refreshData(nextProps);
		}
	}

	shouldRefreshData = {
		page:(nextProps)=>this.shouldRefreshData['post'](nextProps),
		post:(nextProps)=>{
			return false;
		},
		slide:(nextProps)=>{
			return (nextProps.slideShowID!==this.props.slideShowID);
		},
	}

	prepareArgs = {
		page:(props,page)=>this.prepareArgs['post'](props,page),
		post:(props,page)=>{
			return {
				perPage: AppSettings.sourcelists.perPage,
				page: page,
			};
		},
		slide:(props,page)=>{
			if(props.slideShowID)
				return {
					slideShowID: props.slideShowID,
					page: page,
				};
			else return false;
		},
	}

	refreshData = (props=this.props,page)=>{
		let type = props.type;
		if(!type) return null;
		else{
			let args = this.prepareArgs[type](props,page);
			if(!args){ 
				return;
			}
			var processID = shortid.generate();
			this.retrivingData = processID;
			this.setState({page:page,isLoading:true,sources:[]});
			return this.retreiveSources[type](args).then(
				data=>{
					if(this.retrivingData !== processID) return;
					this.setState({...data,isLoading:false});
				},
				err=>{throw err}
			);
		}
	}

	retreiveSources = {
		page:({perPage,page})=>{
			return SourcesLoader.retreivePages(perPage,page).then(
				({pageCount,pages,images})=>({sources:{page:pages,images:images},pageCount:pageCount}),
				err=>{throw err}
			)
		},
		post:({perPage,page})=>{
			return SourcesLoader.retreivePosts(perPage,page).then(
				({pageCount,posts,images})=>({sources:{post:posts,images:images},pageCount:pageCount}),
				err=>{throw err}
			)
		},
		slide:({slideShowID,page})=>{
			return SourcesLoader.retreiveSlides(slideShowID,page).then(
				({slides,pageCount})=>({sources:{slide:slides}}),
				err=>{throw err;}
			);
		},
	}

	render(){
		return (
			<div className="sources-list">
				{this.renderPagination()}
				{this.renderList()}
			</div>
		);
	}

	renderPagination = ()=>{
		if(this.state.pageCount<=1) return;

		return (
			<ReactPaginate
					onPageChange={this.handlePageClick}
					pageCount={this.state.pageCount}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					
					previousLabel={"previous"}
					nextLabel={"next"}
					breakLabel={<a href="">...</a>}
					breakClassName={"break-me"}
					containerClassName={"pagination no-select-all"}
					subContainerClassName={"pages pagination"}
					activeClassName={"active"} />
		);
	}

	renderList = ()=>{
		if(this.state.isLoading) return <span className="spinner block is-active"></span>;
		else return <SourceList slideShowID={this.props.slideShowID} type={this.props.type} sources={this.state.sources} />;
	}

	handlePageClick = data=> {
		let page = data.selected+1;
		this.refreshData(this.props,page);
	};

}