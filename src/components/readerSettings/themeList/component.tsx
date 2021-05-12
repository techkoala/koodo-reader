//修改阅读器背景色
import React from "react";
import { backgroundList, textList } from "../../../constants/themeList";
import StyleUtil from "../../../utils/readUtils/styleUtil";
import "./themeList.css";
import { Trans } from "react-i18next";
import { ThemeListProps, ThemeListState } from "./interface";
import OtherUtil from "../../../utils/otherUtil";
import { Panel as ColorPickerPanel } from "rc-color-picker";
import "rc-color-picker/assets/index.css";
import ThemeUtil from "../../../utils/readUtils/themeUtil";

class ThemeList extends React.Component<ThemeListProps, ThemeListState> {
  constructor(props: ThemeListProps) {
    super(props);
    this.state = {
      currentBackgroundIndex: backgroundList
        .concat(ThemeUtil.getAllThemes())
        .findIndex((item) => {
          return (
            item ===
            (OtherUtil.getReaderConfig("backgroundColor") ||
              "rgba(255,255,255,1)")
          );
        }),
      currentTextIndex: textList
        .concat(ThemeUtil.getAllThemes())
        .findIndex((item) => {
          return (
            item === (OtherUtil.getReaderConfig("textColor") || "rgba(0,0,0,1)")
          );
        }),
      isShowTextPicker: false,
      isShowBgPicker: false,
    };
  }
  handleChangeBgColor = (color: string, index: number = -1) => {
    OtherUtil.setReaderConfig("backgroundColor", color);
    this.setState({
      currentBackgroundIndex: index,
    });
    if (index === 3) {
      this.props.currentEpub.rendition.themes.default({
        "a, article, cite, code, div, li, p, pre, span, table": {
          color: `white !important`,
        },
      });
    } else if (
      index === 2 &&
      OtherUtil.getReaderConfig("backgroundColor") === "rgba(255,255,255,1)"
    ) {
      this.props.currentEpub.rendition.themes.default({
        "a, article, cite, code, div, li, p, pre, span, table": {
          color: `black !important`,
        },
      });
    } else {
      this.props.currentEpub.rendition.themes.default({
        "a, article, cite, code, div, li, p, pre, span, table": {
          color: `inherit !important`,
        },
      });
    }
    StyleUtil.addDefaultCss();
  };
  handleChooseBgColor = (color) => {
    OtherUtil.setReaderConfig("backgroundColor", color.color);
    StyleUtil.addDefaultCss();
  };
  handleColorTextPicker = (isShowTextPicker: boolean) => {
    if (
      !isShowTextPicker &&
      textList.concat(ThemeUtil.getAllThemes()).findIndex((item) => {
        return (
          item === (OtherUtil.getReaderConfig("textColor") || "rgba(0,0,0,1)")
        );
      }) === -1
    ) {
      ThemeUtil.setThemes(OtherUtil.getReaderConfig("textColor"));
    }
    this.setState({ isShowTextPicker });
  };
  handleColorBgPicker = (isShowBgPicker: boolean) => {
    if (
      !isShowBgPicker &&
      backgroundList.concat(ThemeUtil.getAllThemes()).findIndex((item) => {
        return (
          item ===
          (OtherUtil.getReaderConfig("backgroundColor") ||
            "rgba(255,255,255,1)")
        );
      }) === -1
    ) {
      ThemeUtil.setThemes(OtherUtil.getReaderConfig("backgroundColor"));
    }
    this.setState({ isShowBgPicker });
  };
  handleChooseTextColor = (color) => {
    if (typeof color !== "object") {
      this.setState({
        currentTextIndex: textList
          .concat(ThemeUtil.getAllThemes())
          .indexOf(color),
      });
    }
    OtherUtil.setReaderConfig(
      "textColor",
      typeof color === "object" ? color.color : color
    );
    this.props.currentEpub.rendition.themes.default({
      "a, article, cite, code, div, li, p, pre, span, table": {
        color: `${typeof color === "object" ? color.color : color} !important`,
      },
    });
  };
  render() {
    const renderBackgroundColorList = () => {
      return backgroundList
        .concat(ThemeUtil.getAllThemes())
        .map((item, index) => {
          return (
            <li
              key={item + index}
              className={
                index === this.state.currentBackgroundIndex
                  ? "active-color background-color-circle"
                  : "background-color-circle"
              }
              onClick={() => {
                this.handleChangeBgColor(item, index);
              }}
              style={{ backgroundColor: item }}
            >
              {index > 3 && index === this.state.currentBackgroundIndex && (
                <span
                  className="icon-close"
                  onClick={() => {
                    ThemeUtil.clear(item);
                  }}
                ></span>
              )}
            </li>
          );
        });
    };
    const renderTextColorList = () => {
      return textList.concat(ThemeUtil.getAllThemes()).map((item, index) => {
        return (
          <li
            key={item + index}
            className={
              index === this.state.currentTextIndex
                ? "active-color background-color-circle"
                : "background-color-circle"
            }
            onClick={() => {
              this.handleChooseTextColor(item);
            }}
            style={{ backgroundColor: item }}
          >
            {index > 3 && index === this.state.currentTextIndex && (
              <span
                className="icon-close"
                onClick={() => {
                  ThemeUtil.clear(item);
                }}
              ></span>
            )}
          </li>
        );
      });
    };
    return (
      <div className="background-color-setting">
        <div className="background-color-text">
          <Trans>Background Color</Trans>
        </div>
        <ul className="background-color-list">
          <li
            className="background-color-circle"
            onClick={() => {
              this.handleColorBgPicker(!this.state.isShowBgPicker);
            }}
          >
            <span className="icon-more"></span>
          </li>

          {renderBackgroundColorList()}
        </ul>
        {this.state.isShowBgPicker && (
          <ColorPickerPanel
            enableAlpha={false}
            color={"#345679"}
            onChange={this.handleChooseBgColor}
            mode="RGB"
            style={{
              margin: 20,
              animation: "fade-in 0.2s ease-in-out 0s 1",
            }}
          />
        )}
        <div className="background-color-text">
          <Trans>Text Color</Trans>
        </div>
        <ul className="background-color-list">
          <li
            className="background-color-circle"
            onClick={() => {
              this.handleColorTextPicker(!this.state.isShowTextPicker);
            }}
          >
            <span className="icon-more"></span>
          </li>

          {renderTextColorList()}
        </ul>
        {this.state.isShowTextPicker && (
          <ColorPickerPanel
            enableAlpha={false}
            color={"#345679"}
            onChange={this.handleChooseTextColor}
            mode="RGB"
            style={{
              margin: 20,
              animation: "fade-in 0.2s ease-in-out 0s 1",
            }}
          />
        )}
      </div>
    );
  }
}

export default ThemeList;
