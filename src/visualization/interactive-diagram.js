/**
 * Interactive Chakra-Kabbalah Visualization
 * Creates interactive SVG diagrams for both systems with correspondence overlays
 */

class ChakraKabbalahVisualization {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      width: options.width || 800,
      height: options.height || 600,
      showChakras: options.showChakras !== false,
      showSephirot: options.showSephirot !== false,
      showCorrespondences: options.showCorrespondences || false,
      interactive: options.interactive !== false,
      animate: options.animate || true,
      ...options
    };
    this.colors = {
      chakras: ['#FF0000', '#FFA500', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
      sephirot: '#FFFFFF',
      paths: '#666666',
      highlight: '#FFD700',
      text: '#000000'
    };
  }

  /**
   * Initialize the visualization
   */
  init() {
    this.svg = this.createSVG();
    this.container.appendChild(this.svg);
    this.drawDiagram();
    this.attachEvents();
  }

  /**
   * Create SVG element
   */
  createSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', this.options.width);
    svg.setAttribute('height', this.options.height);
    svg.setAttribute('viewBox', `0 0 ${this.options.width} ${this.options.height}`);
    svg.style.fontFamily = 'Arial, sans-serif';
    return svg;
  }

  /**
   * Draw the main diagram
   */
  drawDiagram() {
    this.svg.innerHTML = ''; // Clear

    if (this.options.showChakras && this.options.showSephirot) {
      // Split view or integrated view
      this.drawSplitView();
    } else if (this.options.showChakras) {
      this.drawChakraSystem();
    } else if (this.options.showSephirot) {
      this.drawTreeOfLife();
    }

    if (this.options.showCorrespondences) {
      this.drawCorrespondences();
    }
  }

  /**
   * Draw split view with both systems
   */
  drawSplitView() {
    const midX = this.options.width / 2;

    // Draw separator
    const separator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    separator.setAttribute('x1', midX);
    separator.setAttribute('y1', 20);
    separator.setAttribute('x2', midX);
    separator.setAttribute('y2', this.options.height - 20);
    separator.setAttribute('stroke', this.colors.paths);
    separator.setAttribute('stroke-width', '2');
    separator.setAttribute('stroke-dasharray', '5,5');
    this.svg.appendChild(separator);

    // Draw chakras on left
    this.drawChakraSystem(0, 0, midX, this.options.height);

    // Draw Tree of Life on right
    this.drawTreeOfLife(midX, 0, midX, this.options.height);
  }

  /**
   * Draw the Chakra system
   */
  drawChakraSystem(offsetX = 0, offsetY = 0, width = this.options.width, height = this.options.height) {
    const centerX = offsetX + width / 4;
    const spacing = (height - 100) / 8;
    const startY = offsetY + 60;

    const chakraNames = ['Sahasrara', 'Ajna', 'Vishuddha', 'Anahata', 'Manipura', 'Svadhisthana', 'Muladhara'];
    const chakraElements = ['Consciousness', 'Light', 'Ether', 'Air', 'Fire', 'Water', 'Earth'];

    // Draw central channel (sushumna)
    const channel = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    channel.setAttribute('x1', centerX);
    channel.setAttribute('y1', startY - 30);
    channel.setAttribute('x2', centerX);
    channel.setAttribute('y2', startY + 7 * spacing);
    channel.setAttribute('stroke', '#C0C0C0');
    channel.setAttribute('stroke-width', '3');
    this.svg.appendChild(channel);

    // Draw each chakra
    chakraNames.forEach((name, i) => {
      const y = startY + i * spacing;
      const chakraGroup = this.createChakra(centerX, y, name, chakraElements[i], this.colors.chakras[6 - i], i);
      this.svg.appendChild(chakraGroup);
    });

    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', centerX);
    title.setAttribute('y', offsetY + 30);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '20');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Chakra System';
    this.svg.appendChild(title);
  }

  /**
   * Create a single chakra visualization
   */
  createChakra(x, y, name, element, color, index) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'chakra');
    group.setAttribute('data-chakra', name.toLowerCase());
    group.style.cursor = 'pointer';

    // Outer circle
    const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    outerCircle.setAttribute('cx', x);
    outerCircle.setAttribute('cy', y);
    outerCircle.setAttribute('r', '30');
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', color);
    outerCircle.setAttribute('stroke-width', '3');
    group.appendChild(outerCircle);

    // Inner circle (petals representation)
    const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    innerCircle.setAttribute('cx', x);
    innerCircle.setAttribute('cy', y);
    innerCircle.setAttribute('r', '20');
    innerCircle.setAttribute('fill', color);
    innerCircle.setAttribute('opacity', '0.3');
    group.appendChild(innerCircle);

    // Sanskrit number (small)
    const number = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    number.setAttribute('x', x);
    number.setAttribute('y', y + 5);
    number.setAttribute('text-anchor', 'middle');
    number.setAttribute('font-size', '14');
    number.setAttribute('fill', color);
    number.textContent = 7 - index;
    group.appendChild(number);

    // Name label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x + 40);
    label.setAttribute('y', y + 5);
    label.setAttribute('font-size', '12');
    label.setAttribute('fill', this.colors.text);
    label.textContent = name;
    group.appendChild(label);

    // Element label
    const elementLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    elementLabel.setAttribute('x', x + 40);
    elementLabel.setAttribute('y', y + 20);
    elementLabel.setAttribute('font-size', '10');
    elementLabel.setAttribute('fill', '#666');
    elementLabel.textContent = element;
    group.appendChild(elementLabel);

    return group;
  }

  /**
   * Draw the Tree of Life
   */
  drawTreeOfLife(offsetX = 0, offsetY = 0, width = this.options.width, height = this.options.height) {
    const centerX = offsetX + width / 4;
    const scale = Math.min(width, height) / 500;
    const treeY = offsetY + 80;

    // Sephirot positions (based on traditional Tree of Life layout)
    const positions = {
      keter: { x: centerX, y: treeY },
      chokhmah: { x: centerX + 40 * scale, y: treeY + 70 * scale },
      binah: { x: centerX - 40 * scale, y: treeY + 70 * scale },
      chesed: { x: centerX + 60 * scale, y: treeY + 150 * scale },
      gevurah: { x: centerX - 60 * scale, y: treeY + 150 * scale },
      tiferet: { x: centerX, y: treeY + 170 * scale },
      netzach: { x: centerX + 50 * scale, y: treeY + 240 * scale },
      hod: { x: centerX - 50 * scale, y: treeY + 240 * scale },
      yesod: { x: centerX, y: treeY + 260 * scale },
      malkuth: { x: centerX, y: treeY + 340 * scale }
    };

    // Draw paths (connections between sephirot)
    const paths = [
      ['keter', 'chokhmah'], ['keter', 'binah'], ['keter', 'tiferet'],
      ['chokhmah', 'binah'], ['chokhmah', 'chesed'], ['chokhmah', 'tiferet'],
      ['binah', 'gevurah'], ['binah', 'tiferet'],
      ['chesed', 'gevurah'], ['chesed', 'tiferet'], ['chesed', 'netzach'], ['chesed', 'yesod'],
      ['gevurah', 'hod'], ['gevurah', 'yesod'], ['gevurah', 'tiferet'],
      ['tiferet', 'netzach'], ['tiferet', 'hod'], ['tiferet', 'yesod'],
      ['netzach', 'hod'], ['netzach', 'yesod'], ['netzach', 'malkuth'],
      ['hod', 'yesod'],
      ['yesod', 'malkuth']
    ];

    paths.forEach(([from, to]) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', positions[from].x);
      line.setAttribute('y1', positions[from].y);
      line.setAttribute('x2', positions[to].x);
      line.setAttribute('y2', positions[to].y);
      line.setAttribute('stroke', this.colors.paths);
      line.setAttribute('stroke-width', '1.5');
      this.svg.appendChild(line);
    });

    // Draw sephirot
    Object.entries(positions).forEach(([id, pos]) => {
      const sephiraGroup = this.createSephira(pos.x, pos.y, id);
      this.svg.appendChild(sephiraGroup);
    });

    // Draw pillars labels
    this.drawPillarLabels(centerX, treeY + 200 * scale, scale);

    // Title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', centerX);
    title.setAttribute('y', offsetY + 30);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-size', '20');
    title.setAttribute('font-weight', 'bold');
    title.textContent = 'Tree of Life';
    this.svg.appendChild(title);
  }

  /**
   * Create a single sephira visualization
   */
  createSephira(x, y, id) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', 'sephira');
    group.setAttribute('data-sephira', id);
    group.style.cursor = 'pointer';

    // Circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '18');
    circle.setAttribute('fill', this.colors.sephirot);
    circle.setAttribute('stroke', '#000');
    circle.setAttribute('stroke-width', '2');
    group.appendChild(circle);

    // Hebrew number (small representation)
    const hebrewNums = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'];
    const numIndex = ['keter', 'chokhmah', 'binah', 'chesed', 'gevurah', 'tiferet', 'netzach', 'hod', 'yesod', 'malkuth'].indexOf(id);
    const hebrew = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    hebrew.setAttribute('x', x);
    hebrew.setAttribute('y', y + 5);
    hebrew.setAttribute('text-anchor', 'middle');
    hebrew.setAttribute('font-size', '14');
    hebrew.textContent = hebrewNums[numIndex];
    group.appendChild(hebrew);

    // Name label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x);
    label.setAttribute('y', y + 32);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '10');
    label.setAttribute('fill', this.colors.text);
    label.textContent = id.charAt(0).toUpperCase() + id.slice(1);
    group.appendChild(label);

    return group;
  }

  /**
   * Draw pillar labels
   */
  drawPillarLabels(centerX, y, scale) {
    const pillars = [
      { name: 'Severity', x: centerX - 100 * scale },
      { name: 'Balance', x: centerX },
      { name: 'Mercy', x: centerX + 100 * scale }
    ];

    pillars.forEach(pillar => {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', pillar.x);
      label.setAttribute('y', y);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('font-size', '11');
      label.setAttribute('fill', '#666');
      label.textContent = pillar.name;
      this.svg.appendChild(label);
    });
  }

  /**
   * Draw correspondence lines between systems
   */
  drawCorrespondences() {
    const correspondences = [
      { chakra: 'muladhara', sephira: 'malkuth', color: '#FFD700' },
      { chakra: 'svadhisthana', sephira: 'yesod', color: '#FFD700' },
      { chakra: 'manipura', sephira: 'gevurah', color: '#FFD700' },
      { chakra: 'anahata', sephira: 'tiferet', color: '#FFD700' },
      { chakra: 'vishuddha', sephira: 'binah', color: '#C0C0C0' },
      { chakra: 'ajna', sephira: 'chokhmah', color: '#C0C0C0' },
      { chakra: 'sahasrara', sephira: 'keter', color: '#FFD700' }
    ];

    // This would require calculating positions and drawing curved lines
    // between corresponding elements
    correspondences.forEach(corr => {
      // Find positions and draw lines
      // This is a placeholder for the correspondence visualization
    });
  }

  /**
   * Attach interactive events
   */
  attachEvents() {
    if (!this.options.interactive) return;

    // Chakra click events
    this.svg.querySelectorAll('.chakra').forEach(chakra => {
      chakra.addEventListener('click', (e) => {
        const chakraId = e.currentTarget.getAttribute('data-chakra');
        this.highlightChakra(chakraId);
        this.onChakraClick?.(chakraId);
      });

      chakra.addEventListener('mouseenter', (e) => {
        e.currentTarget.style.opacity = '0.8';
      });

      chakra.addEventListener('mouseleave', (e) => {
        e.currentTarget.style.opacity = '1';
      });
    });

    // Sephira click events
    this.svg.querySelectorAll('.sephira').forEach(sephira => {
      sephira.addEventListener('click', (e) => {
        const sephiraId = e.currentTarget.getAttribute('data-sephira');
        this.highlightSephira(sephiraId);
        this.onSephirotClick?.(sephiraId);
      });

      sephira.addEventListener('mouseenter', (e) => {
        e.currentTarget.style.opacity = '0.8';
      });

      sephira.addEventListener('mouseleave', (e) => {
        e.currentTarget.style.opacity = '1';
      });
    });
  }

  /**
   * Highlight a specific chakra
   */
  highlightChakra(chakraId) {
    this.svg.querySelectorAll('.chakra').forEach(c => {
      c.style.strokeWidth = c.getAttribute('data-chakra') === chakraId ? '5' : '3';
      c.style.stroke = c.getAttribute('data-chakra') === chakraId ? this.colors.highlight : '';
    });
  }

  /**
   * Highlight a specific sephira
   */
  highlightSephira(sephiraId) {
    this.svg.querySelectorAll('.sephira').forEach(s => {
      s.style.strokeWidth = s.getAttribute('data-sephira') === sephiraId ? '5' : '2';
      s.style.stroke = s.getAttribute('data-sephira') === sephiraId ? this.colors.highlight : '#000';
    });
  }

  /**
   * Show tooltip with information
   */
  showTooltip(element, info) {
    const tooltip = document.createElement('div');
    tooltip.className = 'viz-tooltip';
    tooltip.innerHTML = info;
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'rgba(0,0,0,0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.pointerEvents = 'none';
    document.body.appendChild(tooltip);

    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - 60) + 'px';

    return tooltip;
  }

  /**
   * Update the visualization
   */
  update(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.drawDiagram();
    this.attachEvents();
  }

  /**
   * Export as SVG string
   */
  exportSVG() {
    return this.svg.outerHTML;
  }

  /**
   * Clear the visualization
   */
  destroy() {
    this.svg.innerHTML = '';
    this.container.removeChild(this.svg);
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChakraKabbalahVisualization;
}
