# Psychological G-Code - Changelog

## [0.1.0] - 2025-01-26

### Initial Release

Complete implementation of the Chakra-Kabbalah correspondence system with self-assessment and interactive visualization tools.

### Data Structure

#### Core Data Files (`data/`)
- **chakras.json**
  - Complete data for all 7 main chakras
  - Sanskrit names, translations, locations
  - Elements, colors, seed syllables
  - Physical, emotional, and mental associations
  - Planetary correspondences
  - Balance and imbalance indicators

- **sephirot.json**
  - Complete data for all 10 sephirot
  - Hebrew names, translations, positions
  - Three pillars: Mercy, Severity, Balance
  - Four worlds: Atziluth, Beriyah, Yetzirah, Assiyah
  - Archangels and angelic orders
  - Tarot correspondences (Major Arcana)
  - All 22 connecting paths with Hebrew letters

- **correspondences.json**
  - Theosophical/Golden Dawn mapping system
  - Alice Bailey/Arcane School correspondences with 7 Rays
  - Triadic mappings (Supernal, Ethical, Astral, Physical)
  - Alternative systems including Da'ath mappings
  - Synthetic integrations:
    - Middle Pillar alignment
    - Pillar balancing with chakra pairs
    - Psychological integration models

- **assessment-questions.json**
  - 56 self-reflection questions (8 per level)
  - 7 levels: Foundation through Transcendence
  - Reverse-scored items to prevent response patterns
  - Category-based analysis (safety, creativity, boundaries, etc.)
  - Pillar assessment questions

### Documentation (`docs/`)

- **chakras.md**
  - Complete reference for all 7 chakras
  - Sanskrit with translations
  - Element, color, seed syllable, gland associations
  - Physical, emotional, and mental meanings
  - Balance vs. imbalance indicators
  - Common misconceptions
  - Resources for further study

- **sephirot.md**
  - Complete reference for all 10 sephirot
  - Hebrew with translations
  - Position, pillar, color, planet correspondences
  - Archangels and angelic orders
  - Psychological associations
  - All 22 paths with Hebrew letters and tarot
  - Da'ath (hidden sephira) explanation
  - Lightning flash and Serpent of Wisdom
  - Hermetic Qabalah vs. traditional Kabbalah
  - Cultural respect considerations

- **correspondences.md**
  - Historical context of Western Esoteric synthesis
  - Primary correspondence systems comparison table
  - Detailed explanations for each mapping
  - Triadic grouping approaches
  - Alternative and Da'ath mappings
  - Practical applications:
    - Middle Pillar alignment practice
    - Pillar balancing techniques
    - Psychological integration by level
  - Research notes for custom mappings
  - Warnings and considerations
  - Recommended resources

- **psychological-applications.md**
  - Integrated consciousness map (7 levels)
  - Comprehensive diagnostic framework
  - Balance assessment for each level:
    - Deficiency signs
    - Excess signs
    - Balanced state
  - Therapeutic approaches by level
  - Pillar-based psychological typology
  - Integration practices:
    - Daily practice routine
    - Weekly practice schedule
    - Crisis work (bottom-up approach)
  - Warnings, ethics, and when to seek professional help
  - Resources for deeper study

- **assessment-guide.md**
  - How the assessment works
  - Scoring scale and interpretation
  - Taking the assessment best practices
  - Understanding results (level scores, pillar assessment)
  - Working with results (deficiency, excess, balance)
  - Pillar work (Mercy, Severity, Balance)
  - Practice library by level:
    - Foundation practices
    - Emotional practices
    - Power practices
    - Heart practices
    - Expression practices
    - Vision practices
    - Transcendence practices
  - Retaking and tracking progress
  - Important cautions
  - When to seek professional help

### Interactive Features (`src/`)

#### Assessment Engine (`assessment-engine.js`)
**Class: `AssessmentEngine`**

Methods:
- `calculateLevelScore()` - Score individual levels
- `interpretScore()` - Categorize scores (very_low, low, balanced, high)
- `assessBalance()` - Determine deficiency, balance, or excess
- `calculateAllScores()` - Generate all level scores
- `analyzeCategories()` - Break down by sub-category
- `calculatePillarDominance()` - Determine Pillar of Mercy/Severity/Balance
- `interpretPillarDominance()` - Generate pillar profile
- `generateRecommendations()` - Create personalized practice list
- `getPracticesForLevel()` - Retrieve specific practices
- `generateReport()` - Full assessment report with summary

Features:
- Automatic reverse scoring
- Category-level analysis
- Pillar dominance detection
- Priority-based recommendations
- Narrative summary generation
- Progress tracking support

#### Interactive Visualization (`visualization/`)

**JavaScript Module (`interactive-diagram.js`)**

Class: `ChakraKabbalahVisualization`

Features:
- SVG-based diagram rendering
- Side-by-side system comparison
- Clickable chakras and sephirot
- Hover effects and animations
- Information panel population
- Correspondence line overlays
- Responsive design
- Keyboard navigation
- Export as SVG
- Configuration options

Methods:
- `init()` - Initialize visualization
- `drawChakraSystem()` - Render chakras vertically
- `drawTreeOfLife()` - Render Tree of Life diagram
- `drawSplitView()` - Both systems side-by-side
- `createChakra()` - Individual chakra visualization
- `createSephira()` - Individual sephira visualization
- `drawCorrespondences()` - Overlay correspondence mappings
- `highlightChakra()` - Highlight specific chakra
- `highlightSephira()` - Highlight specific sephira
- `showTooltip()` - Display information
- `update()` - Update with new options
- `exportSVG()` - Export diagram as SVG
- `destroy()` - Clean up visualization

**Stylesheet (`interactive-diagram.css`)**

- Responsive design
- Animations (fade-in, hover effects, pulse)
- Info panel styling
- Control panel styling
- Legend styling
- Loading state
- Accessibility features
- Print styles
- Mobile-responsive breakpoints

**Standalone Demo (`example.html`)**

Features:
- Complete working example
- Click-to-explore functionality
- Information panel with details
- Keyboard navigation (Escape to close)
- Sample data for all chakras and sephirot
- Self-contained (no external dependencies)

### Schema & Configuration

- **data-schema.json**
  - JSON Schema for data validation
  - Definitions for chakra, sephira, and correspondence objects
  - Required field validation
  - Type checking and enums

- **package.json**
  - Project metadata
  - Scripts for validation and serving
  - Keywords for discoverability
  - MIT License

- **.gitignore**
  - Node modules exclusion
  - Build artifacts
  - Environment files
  - IDE and OS files
  - Logs and temporary files

### Documentation

- **README.md**
  - Project overview
  - Complete data structure
  - Feature descriptions
  - Usage instructions
  - Future development roadmap
  - Contributing guidelines
  - License and credits

### Features Summary

#### 1. Reference & Research
- Comprehensive data on both systems
- Traditional and alternative correspondences
- Cross-references between systems
- Historical context and source notes

#### 2. Self-Assessment
- 56-question self-reflection tool
- Scoring algorithms with reverse scoring
- Pillar dominance detection
- Balance assessment (deficiency/balance/excess)
- Category-level analysis
- Personalized practice recommendations
- Progress tracking capability

#### 3. Interactive Visualization
- Clickable diagrams for both systems
- Side-by-side comparison view
- Information panels with associations
- Correspondence overlays
- Responsive and accessible design
- Works standalone or with frameworks

#### 4. Practical Applications
- Practice library by level (foundation through transcendence)
- Therapeutic approaches for each level
- Pillar balancing practices
- Daily and weekly practice routines
- Crisis intervention framework
- Integration practices

### Technical Details

**Browser Compatibility:**
- Modern ES6+ JavaScript
- SVG rendering
- CSS3 animations
- Responsive design (mobile, tablet, desktop)

**Data Format:**
- JSON for structured data
- Markdown for documentation
- SVG for graphics

**No Build Required:**
- Vanilla JavaScript (no framework dependencies)
- Works directly in browser
- Can be integrated into any project

### Integration Points

The project is designed to integrate with:
- **Web applications** - Use as a library or component
- **Mobile apps** - Data can power native apps
- **Therapy/coaching tools** - Assessment and practice recommendations
- **Educational platforms** - Reference and visualization
- **Research projects** - Structured data for analysis

### Future Roadmap

- [ ] Full web application with user accounts
- [ ] Save and track assessment results over time
- [ ] Mobile applications (iOS/Android)
- [ ] Meditation timer with chakra/sephira focus
- [ ] Community correspondence database
- [ ] Advanced visualizations (3D, animated energy flow)
- [ ] REST API for third-party integrations
- [ ] Multi-language support
- [ ] Audio/visual meditations for each level
- [ ] Printable assessment reports

### Credits

**Data compiled from:**
- Traditional Hindu and Buddhist texts
- Kabbalistic texts (Sefer Yetzirah, Zohar)
- Western Esoteric traditions
- Theosophical Society literature
- Hermetic Order of the Golden Dawn materials
- Alice Bailey / Arcane School teachings
- Modern psychological and energy healing approaches

**Technical Implementation:**
- Claude Sonnet 4.5 (Anthropic)
- Project by Galen Chu

### License

MIT License - Free to use, modify, and distribute

---

## Version History

### 0.1.0 (2025-01-26)
- Initial release
- Complete data structure for chakras and sephirot
- Multiple correspondence mapping systems
- Self-assessment engine with 56 questions
- Interactive SVG visualization
- Comprehensive documentation (5 major guides)
- JSON schema for validation
- Standalone HTML demo

---

## Contributing

Contributions welcome in areas:
- Additional correspondence mappings
- Translation to other languages
- Bug fixes and improvements
- New visualization approaches
- Practice recommendations
- Documentation improvements
- Research and citations

Please ensure:
- Cultural respect for source traditions
- Clear attribution of sources
- Evidence-based approaches for psychological content
- Code follows existing patterns
