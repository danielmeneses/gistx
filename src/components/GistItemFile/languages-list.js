const getExtension = filename => {
  if (filename && typeof filename === 'string') {
    const arr = filename.split('.');
    if (arr.length > 1) return arr[arr.length - 1];
  }
  return null;
};
export const getLanguageByExtension = (filename, langsList) => {
  let lang = { language: 'Simple text', extentions: 'txt' };
  const extToMatch = getExtension(filename);
  if (extToMatch)
    for (let i = 0; i < langsList.length; i++) {
      const langs = langsList[i].value.split(',');
      if (langs.indexOf(extToMatch) > -1)
        return { language: langsList[i].text, extentions: langsList[i].value };
    }

  return lang;
};

export default [
  { key: 'json', value: 'json', text: 'json' },
  { key: 'js', value: 'js', text: 'javascript' },
  { key: 'ts', value: 'ts', text: 'typescript' },
  { key: 'php', value: 'php', text: 'php' },
  { key: 'css', value: 'css', text: 'css' },
  { key: 'txt', value: 'txt', text: 'Simple text' },
  { key: 'cpp', value: 'cpp,cc', text: 'cpp' },
  { key: 'java', value: 'java', text: 'java' },
  { key: 'csharp', value: 'cs,csharp', text: 'csharp' },
  { key: 'markdown', value: 'txt,md', text: 'markdown' },
  { key: 'bat', value: 'bat', text: 'bat' },
  { key: 'fsharp', value: 'fs,fsharp', text: 'fsharp' },
  { key: 'go', value: 'go', text: 'go' },
  { key: 'handlebars', value: 'hbs,handlebars', text: 'handlebars' },
  { key: 'html', value: 'htm,html', text: 'html' },
  { key: 'ini', value: 'ini', text: 'ini' },
  { key: 'lua', value: 'lua', text: 'lua' },
  {
    key: 'objective-c',
    value: 'm',
    text: 'objective-c'
  },
  { key: 'postiats', value: 'dats', text: 'postiats' },
  { key: 'powershell', value: 'ps1', text: 'powershell' },
  { key: 'pug', value: 'pug', text: 'pug' },
  { key: 'python', value: 'py', text: 'python' },
  { key: 'r', value: 'r', text: 'r' },
  { key: 'razor', value: 'cshtml,vbhtml', text: 'razor' },
  { key: 'ruby', value: 'rb', text: 'ruby' },
  { key: 'sql', value: 'sql', text: 'sql' },
  { key: 'swift', value: 'swift', text: 'swift' },
  { key: 'vb', value: 'vb', text: 'vb' },
  { key: 'xml', value: 'xml', text: 'xml' },
  {
    key: 'small basic',
    value: 'sb',
    text: 'small basic'
  },
  { key: 'less', value: 'less', text: 'less' },
  { key: 'scss', value: 'scss', text: 'scss' }
];
