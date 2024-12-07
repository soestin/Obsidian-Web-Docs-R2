/**
 * Utility functions for parsing metadata, dates, and defining common types
 */

export interface Metadata {
    creation_date?: string;
    header?: string;
    subheader?: string;
    creator?: string;
  }
  
  export interface BlogPost {
    file: string;
    metadata: Metadata;
  }
  
  export interface NavigationInfo {
    prev: BlogPost | null;
    next: BlogPost | null;
  }
  
  export function parseMetadata(content: string): [Metadata, string] {
    const metadataRegex = /^---\n([\s\S]*?)\n---\n/;
    const match = content.match(metadataRegex);
    
    if (match) {
      const metadataStr = match[1];
      const metadata: Metadata = {};
      metadataStr.split('\n').forEach(line => {
        const [key, value] = line.split(':').map(s => s.trim());
        metadata[key as keyof Metadata] = value;
      });
      return [metadata, content.slice(match[0].length)];
    }
    
    return [{}, content];
  }
  
  export function parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }
  
  