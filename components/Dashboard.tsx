import React, { useEffect, useState } from 'react';
import { AppMetadata } from '../types';
import { geminiService } from '../services/geminiService';
import { DashboardView } from './DashboardView';

interface DashboardProps {
  metadata: AppMetadata;
}

/**
 * Dashboard is a 'Smart' component:
 * - It handles fetching the AI-generated greeting and smart feature ideas.
 * - It manages the loading state for AI content.
 * - It passes all data to the DashboardView for rendering.
 */
export const Dashboard: React.FC<DashboardProps> = ({ metadata }) => {
  const [greeting, setGreeting] = useState('Loading welcome message...');
  const [features, setFeatures] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      setIsAiLoading(true);
      try {
        const [aiGreeting, aiFeatures] = await Promise.all([
          geminiService.getAppContextualGreeting(metadata),
          geminiService.getSmartFeatureIdeas(metadata)
        ]);
        setGreeting(aiGreeting);
        setFeatures(aiFeatures);
      } catch (error) {
        console.error("AI Initialization failed", error);
        setGreeting(`Welcome to ${metadata.name}`);
      } finally {
        setIsAiLoading(false);
      }
    };

    initializeApp();
  }, [metadata]);

  return (
    <DashboardView
      metadata={metadata}
      greeting={greeting}
      features={features}
      isAiLoading={isAiLoading}
    />
  );
};