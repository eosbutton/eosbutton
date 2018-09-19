import React, { Component } from 'react';
import { connect } from 'react-redux';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import grey from '@material-ui/core/colors/grey';

class MainButton extends Component {
  render() {
    return (
      <div
        style={{
          display: 'inline-block',
        }}
      >
        <div
          style={{
            width: "430px",
            height: "430px",
            position: "relative"
          }}
        >
          <div
            style={{
              width: "430px",
              height: "430px",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            <CircularProgressbar
              percentage={this.props.remainingSeconds / this.props.countdown_cap * 100}
              strokeWidth={4}
              styles={{
                path: {
                  stroke: "#607D8B"
                }
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
            }}
          >
            <div className="main_button_container_button">
              <div className="main_button_hole">
                <div
                  className="main_button_button"
                  onClick={this.props.onPress}
                >
                  <svg
                    className="main_button_eos_icon"
                    viewBox="0 0 100 100"
                  >
                    <polygon
                      points="50 0, 74 31, 84 80, 50 100, 16 80, 26 31"
                    />
                  </svg>
                  <svg
                    className="main_button_lighter_eos_icon"
                    viewBox="0 0 100 100"
                  >
                    <polygon
                      points="50 0, 74 31, 84 80, 50 100, 16 80, 26 31"
                    />
                  </svg>
                  <svg
                    className="main_button_darker_eos_icon"
                    viewBox="0 0 100 100"
                  >
                    <polygon
                      points="50 0, 74 31, 84 80, 50 100, 16 80, 26 31"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => {
    return {
    };
  },
  {
  }
)(MainButton);
