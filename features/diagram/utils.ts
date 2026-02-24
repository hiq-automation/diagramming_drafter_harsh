export const getDescriptiveNameFromCode = (code: string): string => {
    if (!code) return 'diagram';

    // Try to find subgraphs
    const subgraphMatch = code.match(/subgraph\s+([^\n{]+)/i);
    if (subgraphMatch && subgraphMatch[1]) {
        return subgraphMatch[1].replace(/[\[\]\(\)\{\}]/g, '').trim();
    }

    // Try to find the first node label with a descriptive name
    // Matches patterns like NodeId[Label] or NodeId(Label)
    const nodeLabelMatch = code.match(/[a-zA-Z0-0_]+\s*[\[\(]([^\]\)]+)[\]\)]/);
    if (nodeLabelMatch && nodeLabelMatch[1]) {
        return nodeLabelMatch[1].trim();
    }

    // Fallback to a simple node match if no label exists
    const simpleNodeMatch = code.match(/([a-zA-Z0-9_]+)\s*-->/);
    if (simpleNodeMatch && simpleNodeMatch[1]) {
        return simpleNodeMatch[1].trim();
    }

    return 'diagram';
};
