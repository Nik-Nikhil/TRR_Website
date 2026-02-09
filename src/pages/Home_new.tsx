import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import TrophyCanvas from "../components/3d/TrophyCanvas";
import registrationService from "../services/registrationService";

export default function Home() {
  const [currentBg, setCurrentBg] = useState(1);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState('');
  