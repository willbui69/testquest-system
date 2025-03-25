
import { ExtractedPdfData } from '@/types';

/**
 * Extracts data from a PDF file
 * 
 * Note: This is a mock implementation. In a real application, 
 * you would use a PDF parsing library like pdf.js or a backend service
 * with a more robust PDF extraction capability
 */
export async function extractPdfData(file: File): Promise<ExtractedPdfData> {
  return new Promise((resolve, reject) => {
    // Simulate processing delay
    setTimeout(() => {
      try {
        // In a real implementation, we would parse the PDF here
        // For now, we'll return mock data based on the filename

        // Mock extraction logic - pattern matching based on filename
        const filename = file.name.toLowerCase();
        
        // Generate random test ID if filename contains 'test'
        const hasTestId = filename.includes('test');
        const testId = hasTestId ? `TEST-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` : undefined;
        
        // Generate mock result values based on common parameters
        const resultValues: Record<string, string | number> = {};
        
        if (filename.includes('chemical')) {
          resultValues['pH'] = (Math.random() * 14).toFixed(2);
          resultValues['conductivity'] = (Math.random() * 1000 + 100).toFixed(2) + ' μS/cm';
          resultValues['dissolved oxygen'] = (Math.random() * 10 + 2).toFixed(2) + ' mg/L';
        } else if (filename.includes('mechanical')) {
          resultValues['tensile strength'] = (Math.random() * 100 + 200).toFixed(2) + ' MPa';
          resultValues['yield strength'] = (Math.random() * 50 + 150).toFixed(2) + ' MPa';
          resultValues['elongation'] = (Math.random() * 30 + 5).toFixed(2) + '%';
        } else if (filename.includes('electrical')) {
          resultValues['resistance'] = (Math.random() * 100 + 10).toFixed(2) + ' Ω';
          resultValues['voltage'] = (Math.random() * 12 + 5).toFixed(2) + ' V';
          resultValues['current'] = (Math.random() * 1 + 0.1).toFixed(3) + ' A';
        } else {
          // Generic data for other types of files
          resultValues['parameter1'] = (Math.random() * 100).toFixed(2);
          resultValues['parameter2'] = (Math.random() * 200).toFixed(2);
          resultValues['parameter3'] = (Math.random() * 50).toFixed(2);
        }
        
        // Generate summary
        const summaryOptions = [
          'All parameters within expected ranges',
          'Some parameters show minor deviations from standard values',
          'Test completed successfully with nominal results',
          'Sample meets quality standards with noted observations'
        ];
        
        const summary = summaryOptions[Math.floor(Math.random() * summaryOptions.length)];
        
        // Generate timestamp
        const timestamp = new Date().toISOString();
        
        // Generate equipment list
        const equipmentOptions = [
          'Spectrometer Model X-5000',
          'Tensile Testing Machine TM-400',
          'Digital Multimeter DM-934',
          'pH Analyzer PA-230',
          'Microscope ME-100X',
          'Thermal Chamber TC-500'
        ];
        
        const equipmentCount = Math.floor(Math.random() * 3) + 1;
        const equipment = Array.from({ length: equipmentCount }, () => 
          equipmentOptions[Math.floor(Math.random() * equipmentOptions.length)]
        );
        
        // Return the extracted data
        resolve({
          testId,
          resultValues,
          summary,
          timestamp,
          equipment
        });
      } catch (error) {
        reject(new Error('Failed to extract data from PDF'));
      }
    }, 1500); // Simulate processing time
  });
}
