import storage from './storage';
import { generateUniqueId } from './helpers';

export const CONFIG_GIST_DESCRIPTION = '__SNIPS::::CONFIG::::PROPS__';
const TAGS_FILENAME = 'tags.json';

class DB {
  constructor() {
    // { id, content: { files: { content: '' } } }
    this.config = null;

    // binding
    this.getTags = this.getTags.bind(this);
    this.addTag = this.addTag.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.saveConfig = this.saveConfig.bind(this);
    this._getTagsInfo = this._getTagsInfo.bind(this);
    this.getGistTags = this.getGistTags.bind(this);
  }

  setConfig(config = null) {
    this.config = config
      ? config
      : {
          content: {
            description: CONFIG_GIST_DESCRIPTION,
            files: {
              [TAGS_FILENAME]: {
                content: {
                  tags: {},
                  gistTags: {}
                }
              }
            }
          }
        };
  }

  async saveConfig() {
    return new Promise((resolve, reject) => {
      const { id, content } = this.config;
      const newContent = {
        ...content,
        files: {
          ...Object.keys(content.files).reduce((all, key) => {
            all[key] = {
              content: JSON.stringify(content.files[key].content)
            };
            return all;
          }, {})
        }
      };
      if (id)
        storage.saveGist(id, newContent).then(result => {
          resolve(result);
        });
      else
        storage.createGist(newContent).then(result => {
          resolve(result);
        });
    });
  }

  _getTagsInfo(field) {
    if (this.config && this.config.content.files[TAGS_FILENAME]) {
      let content = this.config.content.files[TAGS_FILENAME].content;

      if (typeof content === 'string')
        content = JSON.parse(this.config.content.files[TAGS_FILENAME].content);

      if (content && content[field]) return content[field];
    }
    return {};
  }

  async addTag(color, name) {
    const tags = this.getTags();
    tags[generateUniqueId()] = {
      color,
      name
    };

    const content = {
      ...JSON.parse(this.config.content.files[TAGS_FILENAME].content),
      tags
    };
    this.config.content.files[TAGS_FILENAME].content = content;
    await this.saveConfig();
  }

  getTags() {
    const tags = {
      ...this._getTagsInfo('tags'),
      1: {
        name: 'public',
        color: 'red'
      },
      2: {
        name: 'pivate',
        color: 'blue'
      }
    };
    return tags;
  }

  getGistTags() {
    return this._getTagsInfo('gistTags');
  }
}

export default new DB();
