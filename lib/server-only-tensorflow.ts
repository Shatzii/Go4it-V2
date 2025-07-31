// Server-only TensorFlow.js utilities
// This file should only be imported on the server side

export class ServerTensorFlowUtils {
  private static instance: ServerTensorFlowUtils;
  private tf: any = null;
  private poseDetection: any = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): ServerTensorFlowUtils {
    if (!ServerTensorFlowUtils.instance) {
      ServerTensorFlowUtils.instance = new ServerTensorFlowUtils();
    }
    return ServerTensorFlowUtils.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    // Only initialize on server side
    if (typeof window !== 'undefined' || process.env.IS_CLIENT === 'true') {
      console.log('Skipping TensorFlow.js initialization on client side');
      return false;
    }

    try {
      console.log('Initializing server-side TensorFlow.js...');
      
      // Dynamic imports to prevent webpack bundling
      this.tf = await import('@tensorflow/tfjs-node');
      this.poseDetection = await import('@tensorflow-models/pose-detection');
      
      await this.tf.ready();
      console.log('Server-side TensorFlow.js ready');
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize TensorFlow.js on server:', error);
      return false;
    }
  }

  async createPoseDetector(): Promise<any> {
    if (!this.isInitialized) {
      const success = await this.initialize();
      if (!success) return null;
    }

    try {
      const detectorConfig = {
        modelType: this.poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
      };
      
      return await this.poseDetection.createDetector(
        this.poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
    } catch (error) {
      console.error('Failed to create pose detector:', error);
      return null;
    }
  }

  isAvailable(): boolean {
    return this.isInitialized && this.tf !== null;
  }
}

// Export singleton instance
export const serverTensorFlow = ServerTensorFlowUtils.getInstance();