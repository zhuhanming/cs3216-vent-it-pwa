import React from 'react';

class LongText extends React.Component {
  state = { showAll: false }
  // showMore = () => this.setState({ showAll: true });
  // showLess = () => this.setState({ showAll: false });
  render() {
    const { content, limit } = this.props;
    // const { showAll } = this.state;
    if (content.length <= limit) {
      // there is nothing more to show
      return <div><p className="dont-break-out mb-0 pain-content">{content}</p></div>
    }
    // if (showAll) {
    //   // We show the extended text and a link to reduce it
    //   return <div>
    //     {content}
    //     <br/>
    //     <span className="text-muted" onClick={this.showLess}>Read less</span>
    //   </div>
    // }
    // // In the final case, we show a text with ellipsis and a `Read more` button
    const toShow = content.substring(0, limit) + "...";
    return <div>
      <p className="dont-break-out mb-0 pain-content">
      {toShow}
      </p>
      {/* <span className="text-muted" onClick={this.showMore}>Read more</span> */}
    </div>
  }
}

export default LongText;