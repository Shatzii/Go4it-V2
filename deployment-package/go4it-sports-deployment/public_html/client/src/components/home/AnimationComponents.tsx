import React from 'react';
import { motion } from 'framer-motion';

// Sprint animation - Madden/2K style
export const SprintAnimation = ({ colors, isPlaying }: { colors: any, isPlaying: boolean }) => {
  return (
    <div className="w-full h-full bg-[#0c1325] relative overflow-hidden">
      {/* Track */}
      <div className="absolute inset-x-10 top-1/4 bottom-1/4 border border-white/20 rounded-lg overflow-hidden">
        <div className="absolute top-0 bottom-0 left-[25%] w-px h-full bg-white/20"></div>
        <div className="absolute top-0 bottom-0 left-[50%] w-px h-full bg-white/20"></div>
        <div className="absolute top-0 bottom-0 left-[75%] w-px h-full bg-white/20"></div>
        
        {/* Lane marks */}
        <div className="absolute top-1/3 w-full h-px bg-white/20"></div>
        <div className="absolute top-2/3 w-full h-px bg-white/20"></div>
        
        {/* Runner animation - improved football player shape */}
        <motion.div
          className="absolute bottom-1/3 left-[10%] w-10 h-16 flex flex-col items-center justify-center"
          animate={isPlaying ? {
            x: ['0%', '80%'],
          } : {}}
          transition={isPlaying ? {
            duration: 3,
            ease: 'easeOut',
            times: [0, 1],
            repeat: Infinity,
            repeatDelay: 1
          } : {}}
        >
          {/* More realistic player shape */}
          <div className="relative w-10 h-16">
            {/* Body */}
            <div
              className="absolute w-8 h-10 rounded-md top-2 left-1"
              style={{ backgroundColor: colors.primary }}
            ></div>
            
            {/* Helmet */}
            <div className="w-6 h-6 rounded-t-xl bg-gray-700 absolute top-[-4px] left-2"></div>
            <div 
              className="w-4 h-1 absolute top-0 left-3"
              style={{ backgroundColor: colors.secondary }}
            ></div>
            
            {/* Number */}
            <div className="absolute top-4 left-3 w-4 h-4 flex items-center justify-center">
              <span className="text-white text-xs font-bold">4</span>
            </div>
            
            {/* Legs */}
            <motion.div 
              className="absolute left-2 bottom-0 w-2 h-6 rounded-md bg-gray-700"
              animate={isPlaying ? { rotate: [0, 30, 0, -30, 0] } : {}}
              transition={isPlaying ? { repeat: Infinity, duration: 0.3 } : {}}
              style={{ transformOrigin: 'top center' }}
            ></motion.div>
            
            <motion.div 
              className="absolute right-2 bottom-0 w-2 h-6 rounded-md bg-gray-700"
              animate={isPlaying ? { rotate: [0, -30, 0, 30, 0] } : {}}
              transition={isPlaying ? { repeat: Infinity, duration: 0.3 } : {}}
              style={{ transformOrigin: 'top center' }}
            ></motion.div>
            
            {/* Arms */}
            <motion.div 
              className="absolute -left-1 top-3 w-2 h-5 rounded-md bg-gray-700"
              animate={isPlaying ? { rotate: [0, 45, 0, -45, 0] } : {}}
              transition={isPlaying ? { repeat: Infinity, duration: 0.3 } : {}}
              style={{ transformOrigin: 'top center' }}
            ></motion.div>
            
            <motion.div 
              className="absolute -right-1 top-3 w-2 h-5 rounded-md bg-gray-700"
              animate={isPlaying ? { rotate: [0, -45, 0, 45, 0] } : {}}
              transition={isPlaying ? { repeat: Infinity, duration: 0.3 } : {}}
              style={{ transformOrigin: 'top center' }}
            ></motion.div>
          </div>
          
          {/* Speed motion effects */}
          <motion.div
            className="absolute left-[-5px] top-1/2 w-8 h-1 rounded-full transform -translate-y-1/2"
            style={{ backgroundColor: colors.primary }}
            animate={isPlaying ? { 
              opacity: [0, 0.7, 0],
              x: [0, -15, -25],
              scale: [1, 0.7, 0.5]
            } : {}}
            transition={isPlaying ? { repeat: Infinity, duration: 0.3 } : {}}
          />
          
          <motion.div
            className="absolute left-[-10px] top-1/3 w-6 h-1 rounded-full transform -translate-y-1/2"
            style={{ backgroundColor: colors.accent }}
            animate={isPlaying ? { 
              opacity: [0, 0.5, 0],
              x: [5, -10, -20],
              scale: [1, 0.8, 0.6]
            } : {}}
            transition={isPlaying ? { repeat: Infinity, duration: 0.3, delay: 0.1 } : {}}
          />
        </motion.div>
      </div>
      
      {/* Environment elements */}
      <div className="absolute top-1/4 right-1/4 w-6 h-16 flex flex-col items-center">
        <div 
          className="w-6 h-6 flex items-center justify-center rounded-full text-white text-xs"
          style={{ backgroundColor: colors.secondary }}
        >
          F
        </div>
        <div className="w-px h-full" style={{ backgroundColor: colors.secondary }}></div>
      </div>
      
      {/* Start line */}
      <div 
        className="absolute top-1/4 bottom-1/4 left-[10%] w-1 rounded-full"
        style={{ backgroundColor: colors.secondary }}
      ></div>
      
      {/* Finish line */}
      <div 
        className="absolute top-1/4 bottom-1/4 left-[90%] w-1 rounded-full"
        style={{ backgroundColor: colors.primary }}
      ></div>
      
      {/* Track lighting effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      
      {/* Field markers */}
      <div className="absolute bottom-10 left-[15%] text-white/40 text-xs">10</div>
      <div className="absolute bottom-10 left-[35%] text-white/40 text-xs">20</div>
      <div className="absolute bottom-10 left-[55%] text-white/40 text-xs">30</div>
      <div className="absolute bottom-10 left-[75%] text-white/40 text-xs">40</div>
    </div>
  );
};

// Vertical jump animation
export const VerticalAnimation = ({ colors, isPlaying }: { colors: any, isPlaying: boolean }) => {
  return (
    <div className="w-full h-full bg-[#0c1325] relative overflow-hidden">
      {/* Jump area */}
      <div className="absolute inset-10 flex items-center justify-center">
        {/* Measurement board */}
        <div className="relative h-3/4 w-16 bg-gray-800/50 rounded-lg overflow-hidden flex">
          {/* Measurement markers */}
          <div className="relative w-8 h-full">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-2 h-px bg-white/40 left-0"
                style={{ bottom: `${i * 10}%` }}
              ></div>
            ))}
            
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="absolute w-4 h-px bg-white/60 left-0"
                style={{ bottom: `${i * 10 + 5}%` }}
              ></div>
            ))}
            
            {/* Height values */}
            {[0, 2, 4, 6, 8, 10].map((val) => (
              <div 
                key={val} 
                className="absolute -left-6 text-xs text-white/80"
                style={{ bottom: `${val * 10}%`, transform: 'translateY(50%)' }}
              >
                {val * 5}"
              </div>
            ))}
          </div>
          
          {/* Colored gradient background */}
          <div className="relative w-8 h-full bg-gradient-to-t from-transparent to-blue-900/20">
            {/* Target mark */}
            <motion.div
              className="absolute w-full h-2 right-0"
              style={{ backgroundColor: colors.primary, bottom: '77%' }}
              animate={isPlaying ? {
                opacity: [0.6, 1, 0.6],
              } : {}}
              transition={isPlaying ? {
                duration: 1.5,
                repeat: Infinity,
              } : {}}
            />
          </div>
        </div>
        
        {/* Jumper - Basketball player style */}
        <motion.div
          className="absolute bottom-[10%] -left-8 w-14 h-20"
          animate={isPlaying ? {
            y: ['0%', '-65%', '0%'],
            x: ['0%', '15%', '30%'],
          } : {}}
          transition={isPlaying ? {
            duration: 2.5,
            times: [0, 0.5, 1],
            ease: ['easeIn', 'easeOut'],
            repeat: Infinity,
            repeatDelay: 1
          } : {}}
        >
          {/* More realistic basketball player */}
          <div className="relative w-full h-full">
            {/* Jersey */}
            <div 
              className="absolute w-10 h-12 rounded-md left-2 top-1"
              style={{ backgroundColor: colors.primary }}
            ></div>
            
            {/* Head */}
            <div className="w-7 h-7 rounded-full bg-gray-700 absolute -top-3 left-3.5"></div>
            
            {/* Number */}
            <div className="absolute top-5 left-5 w-4 h-4 flex items-center justify-center">
              <span className="text-white text-xs font-bold">23</span>
            </div>
            
            {/* Shorts */}
            <div 
              className="absolute w-8 h-5 rounded-md top-[13px] left-3"
              style={{ backgroundColor: colors.secondary }}
            ></div>
            
            {/* Arms */}
            <motion.div 
              className="absolute left-0 top-3 w-2 h-8 rounded-md bg-gray-700 origin-top"
              animate={isPlaying ? { 
                rotate: ['0deg', '170deg', '120deg', '0deg'] 
              } : {}}
              transition={isPlaying ? { 
                duration: 2.5,
                times: [0, 0.4, 0.6, 1],
                repeat: Infinity,
                repeatDelay: 1
              } : {}}
            />
            <motion.div 
              className="absolute right-0 top-3 w-2 h-8 rounded-md bg-gray-700 origin-top"
              animate={isPlaying ? { 
                rotate: ['0deg', '170deg', '120deg', '0deg'] 
              } : {}}
              transition={isPlaying ? { 
                duration: 2.5,
                times: [0, 0.4, 0.6, 1],
                repeat: Infinity,
                repeatDelay: 1
              } : {}}
            />
            
            {/* Legs */}
            <motion.div 
              className="absolute left-3 bottom-0 w-2 h-10 bg-gray-700 rounded-md origin-top"
              animate={isPlaying ? { 
                rotate: ['0deg', '-60deg', '30deg', '0deg']
              } : {}}
              transition={isPlaying ? { 
                duration: 2.5,
                times: [0, 0.3, 0.7, 1],
                repeat: Infinity,
                repeatDelay: 1
              } : {}}
            />
            <motion.div 
              className="absolute right-3 bottom-0 w-2 h-10 bg-gray-700 rounded-md origin-top"
              animate={isPlaying ? { 
                rotate: ['0deg', '-60deg', '30deg', '0deg']
              } : {}}
              transition={isPlaying ? { 
                duration: 2.5,
                times: [0, 0.3, 0.7, 1],
                repeat: Infinity,
                repeatDelay: 1
              } : {}}
            />
          </div>
        </motion.div>
        
        {/* Floor with court markings */}
        <div 
          className="absolute bottom-[5%] left-[5%] right-[5%] h-2"
          style={{ backgroundColor: colors.secondary }}
        ></div>
        
        <div className="absolute bottom-[7%] left-[15%] right-[15%] h-px bg-white/20"></div>
        
        {/* Vertical measurement effect */}
        {isPlaying && (
          <motion.div
            className="absolute left-4 w-px"
            style={{ 
              backgroundColor: colors.accent,
              bottom: '10%',
              height: '0%'
            }}
            animate={{ 
              height: ['0%', '65%', '0%'],
            }}
            transition={{ 
              duration: 2.5,
              times: [0, 0.5, 1],
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
        )}
      </div>
      
      {/* Environment lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/30"></div>
    </div>
  );
};

// Agility animation
export const AgilityAnimation = ({ colors, isPlaying }: { colors: any, isPlaying: boolean }) => {
  return (
    <div className="w-full h-full bg-[#0c1325] relative overflow-hidden">
      {/* Agility course */}
      <div className="absolute inset-10">
        {/* Course layout */}
        <div className="relative h-full w-full">
          {/* Starting position */}
          <div 
            className="absolute bottom-1/4 left-1/4 w-3 h-3 rounded-full"
            style={{ backgroundColor: colors.secondary }}
          ></div>
          
          {/* Course line */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <path
              d={`M 25,75 L 25,25 L 75,25 L 75,75 L 25,75`}
              fill="none"
              stroke={`${colors.secondary}60`}
              strokeWidth="1"
              strokeDasharray="2,1"
            />
          </svg>
          
          {/* Cones with better 3D effect */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 flex flex-col items-center justify-end">
            <div className="w-4 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-3 rounded-sm" style={{ backgroundColor: colors.primary }}></div>
          </div>
          
          <div className="absolute top-1/4 right-1/4 w-4 h-4 flex flex-col items-center justify-end">
            <div className="w-4 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-3 rounded-sm" style={{ backgroundColor: colors.primary }}></div>
          </div>
          
          <div className="absolute bottom-1/4 right-1/4 w-4 h-4 flex flex-col items-center justify-end">
            <div className="w-4 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></div>
            <div className="w-2 h-3 rounded-sm" style={{ backgroundColor: colors.primary }}></div>
          </div>
          
          {/* Runner - football player style with jersey */}
          <motion.div
            className="absolute w-10 h-14"
            style={{ 
              bottom: '25%', 
              left: '25%', 
              marginLeft: '-15px',
              marginBottom: '-20px'
            }}
            animate={isPlaying ? {
              x: ['0%', '50%', '50%', '0%'],
              y: ['0%', '-50%', '-50%', '0%'],
            } : {}}
            transition={isPlaying ? {
              duration: 4,
              times: [0, 0.25, 0.5, 0.75, 1],
              repeat: Infinity,
              repeatDelay: 1
            } : {}}
          >
            {/* Improved player shape */}
            <div className="relative w-full h-full">
              {/* Jersey */}
              <div 
                className="absolute w-8 h-10 rounded-md left-1 top-1"
                style={{ backgroundColor: colors.primary }}
              ></div>
              
              {/* Helmet */}
              <div className="w-6 h-6 rounded-t-xl bg-gray-700 absolute -top-2 left-2"></div>
              <div 
                className="w-4 h-1 absolute top-[-1px] left-3"
                style={{ backgroundColor: colors.secondary }}
              ></div>
              
              {/* Number */}
              <div className="absolute top-4 left-3 w-4 h-4 flex items-center justify-center">
                <span className="text-white text-xs font-bold">7</span>
              </div>
              
              {/* Legs */}
              <motion.div 
                className="absolute left-2 bottom-0 w-2 h-5 rounded-md bg-gray-700 origin-top"
                animate={isPlaying ? { rotate: [-20, 20, -20] } : {}}
                transition={isPlaying ? { repeat: Infinity, duration: 0.3 } : {}}
              />
              <motion.div 
                className="absolute right-2 bottom-0 w-2 h-5 rounded-md bg-gray-700 origin-top"
                animate={isPlaying ? { rotate: [20, -20, 20] } : {}}
                transition={isPlaying ? { repeat: Infinity, duration: 0.3 } : {}}
              />
              
              {/* Arms */}
              <motion.div 
                className="absolute left-[-1px] top-3 w-2 h-5 rounded-md bg-gray-700 origin-top"
                animate={isPlaying ? { rotate: [-40, 40, -40] } : {}}
                transition={isPlaying ? { repeat: Infinity, duration: 0.3 } : {}}
              />
              <motion.div 
                className="absolute right-[-1px] top-3 w-2 h-5 rounded-md bg-gray-700 origin-top"
                animate={isPlaying ? { rotate: [40, -40, 40] } : {}}
                transition={isPlaying ? { repeat: Infinity, duration: 0.3 } : {}}
              />
            </div>
          </motion.div>
          
          {/* Path trace effect - simplified to avoid TypeScript errors */}
          {isPlaying && (
            <motion.div
              className="absolute w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: `${colors.primary}60`,
                boxShadow: `0 0 8px ${colors.primary}80`,
                bottom: '25%', 
                left: '25%',
              }}
              animate={{ 
                opacity: [0, 0.7, 0],
                x: ['0%', '50%', '50%', '0%'],
                y: ['0%', '-50%', '-50%', '0%'],
              }}
              transition={{
                duration: 4,
                times: [0, 0.25, 0.5, 0.75, 1],
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          )}
          
          {/* Field markings */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/10"></div>
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/10"></div>
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10"></div>
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10"></div>
          </div>
        </div>
      </div>
      
      {/* Environment lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/60"></div>
    </div>
  );
};

// Strength animation
export const StrengthAnimation = ({ colors, isPlaying }: { colors: any, isPlaying: boolean }) => {
  return (
    <div className="w-full h-full bg-[#0c1325] relative overflow-hidden">
      {/* Gym environment */}
      <div className="absolute inset-10 flex flex-col items-center justify-center">
        {/* Bench */}
        <div 
          className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-40 h-6 rounded-md"
          style={{ backgroundColor: colors.secondary }}
        ></div>
        
        {/* Bench legs */}
        <div 
          className="absolute bottom-[calc(25%-20px)] left-[calc(50%-56px)] w-3 h-5 rounded-sm"
          style={{ backgroundColor: colors.secondary }}
        ></div>
        <div 
          className="absolute bottom-[calc(25%-20px)] left-[calc(50%+56px)] w-3 h-5 rounded-sm"
          style={{ backgroundColor: colors.secondary }}
        ></div>
        
        {/* Weight rack */}
        <div 
          className="absolute bottom-1/4 right-1/4 w-6 h-20 rounded-sm"
          style={{ backgroundColor: `${colors.secondary}80` }}
        ></div>
        
        {/* Lifter - powerlifter style */}
        <div 
          className="absolute bottom-[calc(25%+6px)] left-1/2 transform -translate-x-1/2 w-32 h-10"
        >
          {/* Powerlifter's body */}
          <div 
            className="w-20 h-10 rounded-md absolute left-6"
            style={{ backgroundColor: colors.primary }}
          ></div>
          
          {/* Powerlifter's head */}
          <div className="w-8 h-8 rounded-full bg-gray-700 absolute -top-5 left-12"></div>
          
          {/* Powerlifter's feet */}
          <div className="w-3 h-6 bg-gray-700 rounded-sm absolute -bottom-6 left-8"></div>
          <div className="w-3 h-6 bg-gray-700 rounded-sm absolute -bottom-6 right-8"></div>
          
          {/* Number */}
          <div className="absolute top-2 left-14 flex items-center justify-center">
            <span className="text-white text-xs font-bold">99</span>
          </div>
          
          {/* Arms */}
          <motion.div 
            className="absolute -left-5 top-0 w-12 h-4 rounded-md bg-gray-700 origin-right"
            animate={isPlaying ? {
              rotate: ['45deg', '-30deg', '45deg'],
            } : {}}
            transition={isPlaying ? {
              duration: 3,
              times: [0, 0.5, 1],
              repeat: Infinity,
              repeatDelay: 0.5
            } : {}}
          >
            {/* Hand */}
            <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-gray-600"></div>
          </motion.div>
          
          <motion.div 
            className="absolute -right-5 top-0 w-12 h-4 rounded-md bg-gray-700 origin-left"
            animate={isPlaying ? {
              rotate: ['-45deg', '30deg', '-45deg'],
            } : {}}
            transition={isPlaying ? {
              duration: 3,
              times: [0, 0.5, 1],
              repeat: Infinity,
              repeatDelay: 0.5
            } : {}}
          >
            {/* Hand */}
            <div className="absolute right-0 top-0 w-4 h-4 rounded-full bg-gray-600"></div>
          </motion.div>
          
          {/* Barbell */}
          <motion.div
            className="absolute left-[-20px] -top-14 w-72 h-4 bg-gray-300 rounded-full flex items-center justify-center"
            animate={isPlaying ? {
              y: ['0rem', '7rem', '0rem'],
            } : {}}
            transition={isPlaying ? {
              duration: 3,
              times: [0, 0.5, 1],
              repeat: Infinity,
              repeatDelay: 0.5
            } : {}}
          >
            {/* Weights - more detailed */}
            <div className="absolute -left-14 flex items-center">
              <div 
                className="w-10 h-10 rounded-sm"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div 
                className="w-8 h-8 rounded-sm ml-1"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div 
                className="w-6 h-6 rounded-sm ml-1"
                style={{ backgroundColor: colors.primary }}
              ></div>
            </div>
            
            <div className="absolute -right-14 flex items-center">
              <div 
                className="w-6 h-6 rounded-sm mr-1"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div 
                className="w-8 h-8 rounded-sm mr-1"
                style={{ backgroundColor: colors.primary }}
              ></div>
              <div 
                className="w-10 h-10 rounded-sm"
                style={{ backgroundColor: colors.primary }}
              ></div>
            </div>
            
            {/* Center grip area */}
            <div className="w-16 h-5 bg-gray-800 rounded-full"></div>
          </motion.div>
        </div>
        
        {/* Rep counter */}
        {isPlaying && (
          <motion.div
            className="absolute top-1/4 right-1/3 px-3 py-1 rounded-md"
            style={{ backgroundColor: `${colors.primary}80` }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.1, 0.2],
              repeat: Infinity,
              repeatDelay: 1.5
            }}
          >
            <span className="text-white font-mono text-lg font-bold">+1</span>
          </motion.div>
        )}
        
        {/* Gym environment details */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ backgroundColor: colors.secondary }}
        ></div>
        
        <div 
          className="absolute top-0 left-1/4 w-px h-full"
          style={{ backgroundColor: colors.secondary, opacity: 0.3 }}
        ></div>
        
        <div 
          className="absolute top-0 right-1/4 w-px h-full"
          style={{ backgroundColor: colors.secondary, opacity: 0.3 }}
        ></div>
      </div>
      
      {/* Environment lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
    </div>
  );
};