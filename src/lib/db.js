import githubAPI from 'github-base';

export const CONFIG_GIST_DESCRIPTION = '__SNIPS::::CONFIG::::PROPS__';
const TAGS_FILENAME = 'tags.json';

class DB {
  constructor() {
    // { id, content: { files: { content: '' } } }
    this.config = null;
  }

  setConfig(config = null) {
    this.config = {
      ...config,
      content: {
        ...config.content,
        files: {
          ...Object.keys(config.content.files).map(key => {
            return {
              [key]: {
                content: JSON.parse(config.content.files[key].content)
              }
            };
          })
        }
      }
    }
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
        githubAPI.patch(`/gists/${id}`, newContent, function(error, gist) {
          if (error) reject(error);
          else resolve(gist);
        });
      else
        githubAPI.post(`/gists`, newContent, function(error, gist) {
          if (error) reject(error);
          else resolve(gist);
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
    return {
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
  }

  getGistTags() {
    return this._getTagsInfo('gistTags');
  }
}

export default new DB();
