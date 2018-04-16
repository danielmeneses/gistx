import storage from './storage';

export const CONFIG_GIST_DESCRIPTION = '__SNIPS::::CONFIG::::PROPS__';
const TAGS_FILENAME = 'tags.json';

class DB {
  constructor() {
    // { id, content: { files: { content: '' } } }
    this.config = null;
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
          ...Object.keys(content.files).map(key => {
            return {
              [key]: {
                content: JSON.stringify(content.files[key].content)
              }
            };
          })
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
      const content = JSON.parse(
        this.config.content.files[TAGS_FILENAME].content
      );
      if (content) if (content[field]) return content[field];
    }
    return {};
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
