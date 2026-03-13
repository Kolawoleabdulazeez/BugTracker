import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { PhoneCall, Mail } from 'lucide-react';
import Image from 'next/image';
import ContactIcon from '../../../public/assets/images/cib-message-icon.svg';
import { useEffect } from 'react';

export default function WhistleBlowingContact() {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const actions = [
    {
      id: 'phone',
      icon: <PhoneCall size={18} />,
      title: 'Whistleblowing Hotline',
      value: '+234 201 906 3600',
      action: () => window.open('tel:+2342019063600'),
    },
    {
      id: 'email',
      icon: <Mail size={18} />,
      title: 'Whistleblowing Email',
      value: 'whistleblower@optimusbank.com',
      action: () =>
        window.open('mailto:whistleblower@optimusbank.com'),
    },
  ];

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1300,
      }}
    >
      {/* CONTACT CARDS */}
      {open && (
        <Stack
          spacing={1.25}
          sx={{
            position: 'absolute',
            bottom: 72,
            right: 0,
            alignItems: 'flex-end',
          }}
        >
          {actions.map((item) => (
            <Box
              key={item.id}
              onClick={() => {
                item.action();
                setOpen(false); // also close after action
              }}
              data-testid={`whistle-${item.id}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: { xs: 1.5, sm: 2 },
                py: { xs: 1.25, sm: 1.5 },
                width: {
                  xs: 'calc(100vw - 96px)',
                  sm: 260,
                  md: 280,
                },
                maxWidth: 320,
                borderRadius: '12px',
                backgroundColor: '#E6EBF5',
                color: '#001F5C',
                cursor: 'pointer',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  backgroundColor: '#DBE2F0',
                },
              }}
            >
              {item.icon}

              <Box>
                <Typography
                  fontSize={{ xs: '0.7rem', sm: '0.75rem' }}
                  fontWeight={600}
                >
                  {item.title}
                </Typography>

                <Typography
                  fontSize={{ xs: '0.8rem', sm: '0.85rem' }}
                  sx={{ opacity: 0.9 }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      {/* FLOATING BUTTON */}
      <IconButton
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          width: 56,
          height: 56,
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'rgba(13, 222, 101, 0.15)',
          },
        }}
      >
        <Image
          src={ContactIcon}
          alt="Whistleblowing contact"
          width={50}
          height={50}
        />
      </IconButton>
    </Box>
  );
}
