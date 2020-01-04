module.exports = {
  base: '/',
  themeConfig: {
    repo: 'bsatrom/particle-alexa-workshop',
    docsDir: 'content',
    editLinks: true,
    editLinkText: 'Help us improve this page!',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Team', link: 'http://particle.io' }
    ],
    sidebar: [
      '/docs/',
      ['/docs/ch1', 'Chapter 1: Getting your Particle Argon online'],
      [
        '/docs/ch2',
        'Chapter 2: Working with Particle Workbench, Primitives & the Device Cloud'
      ],
      ['/docs/ch3', 'Chapter 3: Building an Alexa Skill'],
      ['/docs/ch4', 'Chapter 4: Talking to Particle from Alexa']
    ]
  },
  title: 'Particle & Alexa Workshop',
  description:
    'CodeMash 2020 Workshop for learning IoT development with Particle & Amazon Alexa'
};
