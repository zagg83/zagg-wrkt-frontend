import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  background: #18191c;
  color: #fff;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  max-width: 900px;
  margin: 3rem auto;
  box-shadow: 0 4px 32px #0002;
  font-size: 1.05rem;
  line-height: 1.7;
  overflow-y: auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: #7ecfff #23243a;
  &::-webkit-scrollbar {
    width: 10px;
    background: #23243a;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #7ecfff;
    border-radius: 8px;
  }
`;

const TopBackButton = styled.button`
  background: none;
  color: #7ecfff;
  border: none;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 1.2rem;
  margin-top: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.4em;
  padding: 0.2em 0.5em 0.2em 0;
  &:hover {
    color: #fff;
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  color: #7ecfff;
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 1.5rem 0;
  letter-spacing: 0.01em;
`;

const SectionHeader = styled.h2`
  color: #4fd1c5;
  font-size: 1.15rem;
  font-weight: 700;
  margin: 2.2rem 0 1.1rem 0;
  letter-spacing: 0.01em;
`;

const Paragraph = styled.p`
  margin: 0 0 1.1rem 0;
  white-space: pre-wrap;
`;

const policyText = `ACCEPTABLE USE POLICY
Last updated July 18, 2025





This Acceptable Use Policy ("Policy") is part of our Terms and Conditions ("Legal Terms") and should therefore be read alongside our main Legal Terms: https://www.zaggathletics.com/terms. If you do not agree with these Legal Terms, please refrain from using our Services. Your continued use of our Services implies acceptance of these Legal Terms.


Please carefully review this Policy which applies to any and all:


(a) uses of our Services (as defined in "Legal Terms")
(b) forms, materials, consent tools, comments, post, and all other content available on the Services ("Content")


WHO WE ARE
We are Zaggathletics ("Company," "we," "us," or "our") a company registered in __________ at __________, __________. We operate the website https://www.zaggathletics.com (the "Site"), as well as any other related products and services that refer or link to this Policy (collectively, the "Services").


USE OF THE SERVICES
When you use the Services, you warrant that you will comply with this Policy and with all applicable laws.


You also acknowledge that you may not:
Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.
Make any unauthorized use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.
Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.
Engage in unauthorized framing of or linking to the Services.
Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.
Make improper use of our Services, including our support services or submit false reports of abuse or misconduct.
Engage in any automated use of the Services, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.
Interfere with, disrupt, or create an undue burden on the Services or the networks or the Services connected.
Attempt to impersonate another user or person or use the username of another user.
Use any information obtained from the Services in order to harass, abuse, or harm another person.
Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise.
Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services, except as expressly permitted by applicable law.
Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.
Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.
Delete the copyright or other proprietary rights notice from any Content.
Copy or adapt the Services’ software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.
Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.
Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ("gifs"), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as "spyware" or "passive collection mechanisms" or "pcms").
Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or using or launching any unauthorized script or other software.
Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.
Use the Services in a manner inconsistent with any applicable laws or regulations.


CONSEQUENCES OF BREACHING THIS POLICY
The consequences for violating our Policy will vary depending on the severity of the breach and the user's history on the Services, by way of example:


We may, in some cases, give you a warning, however, if your breach is serious or if you continue to breach our Legal Terms and this Policy, we have the right to suspend or terminate your access to and use of our Services and, if applicable, disable your account. We may also notify law enforcement or issue legal proceedings against you when we believe that there is a genuine risk to an individual or a threat to public safety.


We exclude our liability for all action we may take in response to any of your breaches of this Policy.


HOW CAN YOU CONTACT US ABOUT THIS POLICY?
If you have any further questions or comments, you may contact us by:


Email: support@zaggathletics.com
`;

function renderPolicy(text) {
  const lines = text.split('\n');
  const elements = [];
  let buffer = [];
  function flushBuffer() {
    if (buffer.length) {
      elements.push(
        <Paragraph key={elements.length}>{buffer.join('\n')}</Paragraph>
      );
      buffer = [];
    }
  }
  lines.forEach((line, idx) => {
    // Main title
    if (
      idx === 0 &&
      line.trim().toUpperCase().startsWith('ACCEPTABLE USE POLICY')
    ) {
      flushBuffer();
      elements.push(<Title key={elements.length}>{line.trim()}</Title>);
    }
    // Section headers: all-caps lines or lines ending with a question mark
    else if (
      /^[A-Z0-9\s\-&]+\??$/.test(line.trim()) &&
      line.trim().length > 0 &&
      idx !== 0
    ) {
      flushBuffer();
      elements.push(
        <SectionHeader key={elements.length}>{line.trim()}</SectionHeader>
      );
    } else if (line.trim() === '') {
      flushBuffer();
    } else {
      buffer.push(line);
    }
  });
  flushBuffer();
  return elements;
}

const AcceptableUsePolicy = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <TopBackButton onClick={() => navigate('/settings')}>
        <span
          style={{ fontSize: '1.3em', lineHeight: 1, display: 'inline-block' }}
        >
          &lt;
        </span>
        Back to Settings
      </TopBackButton>
      {renderPolicy(policyText)}
    </Container>
  );
};

export default AcceptableUsePolicy;
