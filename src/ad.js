import React, { Component } from 'react';

export class LeftAd extends Component {
  componentDidMount () {
    //(window.adsbygoogle = window.adsbygoogle || []).push({});
  }

	render () {
    return (
      <div 
      	className='side-ad side-ad-left'>
	      
        <div
          className="ad-container">
          
          <ins className="adsbygoogle ad ad-left-banner"
               data-ad-client="ca-pub-1976459744340939"
               data-ad-slot="5224872415"
               data-ad-format="auto"></ins>
        </div>
      </div>
    );
  }
}

export class RightAd extends Component {
  componentDidMount () {
    //(window.adsbygoogle = window.adsbygoogle || []).push({});
  }

	render () {
    return (
      <div
      	className='side-ad side-ad-right'>
				
        <div
          className="ad-container">
          
          <ins className="adsbygoogle ad ad-right-banner"
               data-ad-client="ca-pub-1976459744340939"
               data-ad-slot="6979262624"
               data-ad-format="auto"></ins>
        </div>
      </div>
    );
  }
}