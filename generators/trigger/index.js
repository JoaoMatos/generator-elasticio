'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    try {
      fs.accessSync(this.destinationPath('component.json'));
      this.compDesc = this.fs.readJSON(this.destinationPath('component.json'), {});

      this.log(yosay('Welcome to the ' + chalk.red('elastic.io trigger ') + ' generator!'));

      this.log('Loaded component descriptor from %s', this.destinationPath('component.json'));
    } catch (error) {
      this.log(
        yosay(
          'I can not find ' +
          chalk.red('component.json') +
          ' in the current directory, ' +
          'please run elasticio:action in the component root folder'
        )
      );
      throw error;
    }
  },
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the good ' + chalk.red('generator-elasticio') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'title',
      message: 'Please enter a triggers title',
      default: true,
      validate: function() {
        return str.length > 0;
      }
    }, {
      type: 'input',
      name: 'id',
      message: 'Please enter a trigger ID',
      default: function (answers) {
        return _.camelCase(answers.title);
      },
      validate: function (str) {
        return str.length > 0;
      }
    }{
      type: 'list',
      name: 'mType',
      message: 'Please select the type of the metadata',
      choices: [
        {
          name: 'Static (known at design time)',
          short: 'Static',
          value: 'Static'
        },
        {
          name: 'Dynamic (fetched at run time)',
          short: 'Dynamic',
          value: 'Dynamic'
        }
      ]
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: function () {
    var id = this.props.id;
    var triggers = {};

    // Check if there's triggers already in component.json
    if (this.compDesc.triggers) {
      triggers = this.compDesc.triggers;
    } else {
      this.compDesc.triggers = triggers;
    }

    // Add the new triggers title and file
    triggers[this.props.id] = {
      title: this.props.title,
      main: "./lib/triggers/" + id + ".js"
    };

    // Add (or not) in and output schemas
    if (this.props.mType === 'static') {
      triggers[this.props.id].metadata = {
        in: "./lib/schemas/" + id + ".in.json",
        out: "./lib/schemas/" + id + ".out.json"
      };
    } else {
      actions[this.props.id].dynamicMetadata = true;
    }

    this.log('Creating trigger code file');
    mkdir('lib/triggers');
    this.fs.copy(
      this.templatePath('trigger.js'),
      this.destinationPath('lib/triggers/' + id + '.js')
    );

    this.fs.writeJSON(this.destinationPath('component.json'), this.compDesc);
    this.log('Updated component descriptor');
  },

  install: function () {
    this.installDependencies();
  }
});
