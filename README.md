# Psychological G-Code

A correspondence system and reference resource integrating the **Chakra system** (7 energy centers from Hindu/Buddhist traditions) with the **Kabbalah Tree of Life** (10 Sephirot from Jewish mysticism/Western Esotericism).

## Project Overview

This project provides structured data on both systems, their traditional correspondences, and serves as a foundation for psychological and spiritual exploration. It combines Eastern and Western mystical frameworks into a unified reference system.

## Data Structure

```
psychological-g-code/
├── data/
│   ├── chakras.json           # 7 chakras with detailed attributes
│   ├── sephirot.json          # 10 sephirot + 22 paths
│   ├── correspondences.json   # Mappings between systems
│   └── assessment-questions.json # Self-reflection questions
├── docs/
│   ├── chakras.md             # Detailed chakra reference
│   ├── sephirot.md            # Detailed sephirot reference
│   ├── correspondences.md     # Mapping explanations
│   ├── psychological-applications.md
│   └── assessment-guide.md    # Assessment system guide
├── src/
│   ├── assessment-engine.js   # Scoring and analysis engine
│   └── visualization/
│       ├── interactive-diagram.js
│       ├── interactive-diagram.css
│       └── example.html       # Standalone demo
├── schema/
│   └── data-schema.json       # JSON schema for validation
└── README.md
```

## What's Included

### Chakra Data (`data/chakras.json`)
- All 7 main chakras (Muladhara through Sahasrara)
- Sanskrit names, translations, locations
- Elements, colors, seed syllables
- Physical, emotional, and mental associations
- Balance and imbalance indicators

### Sephirot Data (`data/sephirot.json`)
- All 10 sephirot (Keter through Malkuth)
- Hebrew names, translations, positions
- Pillars (Mercy, Severity, Balance)
- Archangels, angelic orders, tarot correspondences
- Psychological associations
- 22 connecting paths with Hebrew letters

### Correspondence Mappings (`data/correspondences.json`)
- Traditional Theosophical/Golden Dawn correspondences
- Alice Bailey/Arcane School mappings
- Alternative and expanded systems
- Synthetic integrations (Middle Pillar, polarities)
- Psychological integration models

### Assessment System (`data/assessment-questions.json`, `src/assessment-engine.js`)
- 56 self-reflection questions (8 per level)
- Scoring algorithms for balance assessment
- Pillar dominance detection
- Personalized practice recommendations
- Category-level analysis

### Interactive Visualization (`src/visualization/`)
- SVG-based interactive diagrams
- Chakra system visualization
- Tree of Life diagram
- Click-to-learn functionality
- Correspondence overlays
- Responsive design
- Works standalone or with frameworks

## Purpose

This data is designed for:

1. **Reference & Research** - Study of both systems individually and comparatively
2. **Psychological Work** - Understanding psychological states through mystical frameworks
3. **Self-Assessment** - Reflection tool for personal growth and balance
4. **Interactive Visualization** - Click to explore, learn, and discover connections
5. **Spiritual Practice** - Correspondence-aware meditation and energy work
6. **Personal Exploration** - Documenting custom correspondences and insights

## Usage

### As a Reference
- Read the Markdown documentation in `/docs`
- Explore the JSON data files directly
- Use the data schema for validation

### Interactive Visualization
Open `src/visualization/example.html` in a browser to explore the interactive diagram with:
- Clickable chakras and sephirot
- Information panels on hover
- Side-by-side system comparison

### Assessment System
1. Load `data/assessment-questions.json`
2. Use `src/assessment-engine.js` for scoring
3. Generate personalized reports
4. Receive practice recommendations

See `docs/assessment-guide.md` for complete instructions.

### As a Library
```javascript
// Assessment Engine
import AssessmentEngine from './src/assessment-engine.js';

const engine = new AssessmentEngine();
const report = engine.generateReport(
  assessmentData,
  userResponses,
  pillarResponses
);

// Visualization
import ChakraKabbalahVisualization from './src/visualization/interactive-diagram.js';

const viz = new ChakraKabbalahVisualization('container', {
  showChakras: true,
  showSephirot: true,
  interactive: true
});
viz.init();
```

## Future Development

- [ ] Web application with full assessment integration
- [ ] Save and track assessment results over time
- [ ] Mobile apps for on-the-go assessment
- [ ] Meditation timer with chakra/sephira focus
- [ ] Community correspondence database
- [ ] Advanced visualizations (3D, animated flows)
- [ ] API for integration with other tools

## Contributing

This project is open to additions and refinements of:
- Traditional correspondences with citations
- Additional mapping systems
- Psychological applications
- Cross-cultural research
- Personal insights with clear attribution

## Disclaimer

These correspondences are syncretic and synthetic, not traditional to either original system. They emerge from Western Esoteric traditions (Theosophy, Hermetic Qabalah) that sought to integrate Eastern and Western mystical frameworks.

When working with these systems, please:
- Respect the source traditions and their cultural contexts
- Verify through personal experience
- Avoid treating these as rigid dogmas
- Use as tools for insight, not absolute truths

## License

MIT License - Free to use, modify, and distribute

## Credits

Data compiled from various sources in Western Esotericism, Theosophy, and comparative religion.
