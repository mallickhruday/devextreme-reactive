import * as React from 'react';
import * as PropTypes from 'prop-types';
import { getMessagesFormatter } from '@devexpress/dx-core';
import {
  Template, TemplatePlaceholder, Plugin, TemplateConnector,
} from '@devexpress/dx-react-core';
import { columnChooserItems } from '@devexpress/dx-grid-core';

const pluginDependencies = [
  { name: 'TableColumnVisibility' },
  { name: 'Toolbar' },
];
export class ColumnChooser extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.handleToggle = this.handleToggle.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.setButtonRef = this.setButtonRef.bind(this);
  }

  setButtonRef(button) {
    this.button = button;
  }

  handleToggle() {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  }

  handleHide() {
    this.setState({ visible: false });
  }

  render() {
    const {
      overlayComponent: Overlay,
      containerComponent: Container,
      itemComponent: Item,
      toggleButtonComponent: ToggleButton,
      messages,
    } = this.props;
    const getMessage = getMessagesFormatter(messages);
    const { visible } = this.state;

    return (
      <Plugin
        name="ColumnChooser"
        dependencies={pluginDependencies}
      >
        <Template name="toolbarContent">
          <TemplatePlaceholder />
          <TemplateConnector>
            {(
              { columns, hiddenColumnNames, isColumnTogglingEnabled },
              { toggleColumnVisibility },
            ) => (
              <React.Fragment>
                <ToggleButton
                  buttonRef={this.setButtonRef}
                  onToggle={this.handleToggle}
                  getMessage={getMessage}
                  active={visible}
                />
                <Overlay
                  visible={visible}
                  target={this.button}
                  onHide={this.handleHide}
                >
                  <Container>
                    {columnChooserItems(columns, hiddenColumnNames)
                      .map((item) => {
                        const { name: columnName } = item.column;
                        const togglingEnabled = isColumnTogglingEnabled(columnName);
                        return (
                          <Item
                            key={columnName}
                            item={item}
                            disabled={!togglingEnabled}
                            onToggle={() => toggleColumnVisibility(columnName)}
                          />
                        );
                      })}
                  </Container>
                </Overlay>
              </React.Fragment>
            )}
          </TemplateConnector>
        </Template>
      </Plugin>
    );
  }
}

ColumnChooser.propTypes = {
  overlayComponent: PropTypes.func.isRequired,
  containerComponent: PropTypes.func.isRequired,
  itemComponent: PropTypes.func.isRequired,
  toggleButtonComponent: PropTypes.func.isRequired,
  messages: PropTypes.object,
};

ColumnChooser.defaultProps = {
  messages: {},
};

ColumnChooser.components = {
  overlayComponent: 'Overlay',
  containerComponent: 'Container',
  itemComponent: 'Item',
  toggleButtonComponent: 'ToggleButton',
};
