
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
        // For now, we'll return enhanced mock data based on the filename

        // Mock extraction logic - pattern matching based on filename
        const filename = file.name.toLowerCase();
        
        // Generate test ID with better format if filename contains 'test'
        const hasTestId = filename.includes('test');
        const testId = hasTestId 
          ? `TEST-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` 
          : `TEST-${Math.floor(Math.random() * 90000 + 10000)}`;
        
        // Enhanced mock result values
        const resultValues: Record<string, string | number> = {};
        
        if (filename.includes('chemical')) {
          resultValues['pH'] = (Math.random() * 14).toFixed(2);
          resultValues['conductivity'] = (Math.random() * 1000 + 100).toFixed(2) + ' μS/cm';
          resultValues['dissolved oxygen'] = (Math.random() * 10 + 2).toFixed(2) + ' mg/L';
          resultValues['temperature'] = (Math.random() * 30 + 10).toFixed(1) + ' °C';
          resultValues['turbidity'] = (Math.random() * 5).toFixed(2) + ' NTU';
        } else if (filename.includes('mechanical')) {
          resultValues['tensile strength'] = (Math.random() * 100 + 200).toFixed(2) + ' MPa';
          resultValues['yield strength'] = (Math.random() * 50 + 150).toFixed(2) + ' MPa';
          resultValues['elongation'] = (Math.random() * 30 + 5).toFixed(2) + '%';
          resultValues['hardness'] = (Math.random() * 50 + 30).toFixed(1) + ' HRC';
          resultValues['impact energy'] = (Math.random() * 100 + 50).toFixed(1) + ' J';
        } else if (filename.includes('electrical')) {
          resultValues['resistance'] = (Math.random() * 100 + 10).toFixed(2) + ' Ω';
          resultValues['voltage'] = (Math.random() * 12 + 5).toFixed(2) + ' V';
          resultValues['current'] = (Math.random() * 1 + 0.1).toFixed(3) + ' A';
          resultValues['power'] = (Math.random() * 50 + 10).toFixed(1) + ' W';
          resultValues['frequency'] = (Math.random() * 50 + 50).toFixed(1) + ' Hz';
        } else {
          // Generic data for other types of files
          resultValues['parameter1'] = (Math.random() * 100).toFixed(2) + ' units';
          resultValues['parameter2'] = (Math.random() * 200).toFixed(2) + ' units';
          resultValues['parameter3'] = (Math.random() * 50).toFixed(2) + ' units';
          resultValues['parameter4'] = (Math.random() * 1000).toFixed(0) + ' units';
          resultValues['parameter5'] = (Math.random() * 10).toFixed(3) + ' units';
        }
        
        // Generate detailed summary with analysis
        const getAnalysisStatus = () => {
          const statuses = ['PASS', 'PASS with observations', 'Minor deviations detected', 'PASS with recommendations'];
          return statuses[Math.floor(Math.random() * statuses.length)];
        };
        
        const analysisStatus = getAnalysisStatus();
        
        // More detailed summary with specific observations
        const summaryOptions = [
          `Analysis complete: ${analysisStatus}. All parameters within expected ranges.`,
          `Analysis complete: ${analysisStatus}. Some parameters show minor deviations from standard values but are within acceptable limits.`,
          `Analysis complete: ${analysisStatus}. Test completed successfully with nominal results.`,
          `Analysis complete: ${analysisStatus}. Sample meets quality standards with noted observations.`
        ];
        
        const summary = summaryOptions[Math.floor(Math.random() * summaryOptions.length)];
        
        // Generate timestamp
        const timestamp = new Date().toISOString();
        
        // Generate equipment list with model numbers and calibration dates
        const equipmentOptions = [
          'Spectrometer Model X-5000 (Cal: 2023-05-15)',
          'Tensile Testing Machine TM-400 (Cal: 2023-06-22)',
          'Digital Multimeter DM-934 (Cal: 2023-04-10)',
          'pH Analyzer PA-230 (Cal: 2023-07-01)',
          'Microscope ME-100X (Cal: 2023-02-28)',
          'Thermal Chamber TC-500 (Cal: 2023-03-15)',
          'Oscilloscope OS-2000 (Cal: 2023-06-05)',
          'Signal Generator SG-100 (Cal: 2023-05-20)',
          'Load Cell LC-500N (Cal: 2023-04-25)',
          'Humidity Chamber HC-1000 (Cal: 2023-07-10)'
        ];
        
        // Include 2-4 pieces of equipment for more realistic data
        const equipmentCount = Math.floor(Math.random() * 3) + 2;
        const equipment = Array.from({ length: equipmentCount }, () => 
          equipmentOptions[Math.floor(Math.random() * equipmentOptions.length)]
        );
        
        // Add technician and reference standards
        const technicians = ['J. Smith', 'A. Johnson', 'M. Williams', 'S. Brown', 'R. Jones'];
        const technician = technicians[Math.floor(Math.random() * technicians.length)];
        
        const standards = ['ISO 9001', 'ASTM D882', 'IEC 60601', 'MIL-STD-810', 'IEEE 1547'];
        const referencedStandards = [
          standards[Math.floor(Math.random() * standards.length)],
          standards[Math.floor(Math.random() * standards.length)]
        ];
        
        // Return enhanced extracted data
        resolve({
          testId,
          resultValues,
          summary,
          timestamp,
          equipment,
          technician,
          referencedStandards,
          analysisStatus
        });
      } catch (error) {
        reject(new Error('Failed to extract data from PDF'));
      }
    }, 1500); // Simulate processing time
  });
}
