import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

export const SendEmail = (userEmail, name, stsID, password) => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		host: 'smtp.gmail.com',
		port: 587,
		// secure: true,
		auth: {
			user: 'muhammadhaiderbukhari@gmail.com',
			pass: process.env.ApplicationPassword,
		},
	});
	const mailGenerator = new Mailgen({
		theme: 'default',
		product: {
			name: 'STOREYS',
			link: 'www.storeys.com',
		},
		header: {
			title: 'Yours truly',
			imageUrl: 'https://example.com/logo.png', // Replace with your logo image URL
		},
		footer: {
			name: "Hiii",
			title: 'STOREYS',
			imageUrl: 'https://example.com/signature.png', // Replace with your signature image URL
		},
	});

	const email = {
		body: {
			name: name,
			intro: `Hi! Your credential has been added to our STOREYS system. You can use these to login. Thank you. <br><br>STS ID: ${stsID} <br>Password: ${password} <br><br>`,
			action: {
				instructions: 'Please click the button below to login:',
				button: {
					color: '#22BC66',
					text: 'Login',
					link: 'http://localhost:3000/login',
				},
			},
			outro: 'If you need any help or have questions, please reach out to us at our email (contact@email.com). Or customer support team will always be ready to help you.',
		},
	}

	const emailBody = mailGenerator.generate(email);

	const mailOptions = {
		from: 'muhammadhaiderbukhari@gmail.com',
		to: userEmail,
		subject: `Successfully Created Account at Storeye`,
		html: emailBody,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error sending email:', error);
		} else {
			console.log('Email sent successfully:', info.response);
		}
	});
};