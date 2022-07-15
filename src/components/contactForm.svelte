<script lang="ts">
	let fields = { name: '', email: '', phone: '', message: '' };
	let errors = { name: '', email: '', phone: '', message: '' };
	let formIsValid = false;
	let showTYModal = false;
	// export let fieldName: string;
	// export let value: string | string[];
	export let nameError = false;
	export let phoneError = false;
	export let emailError = false;
	export let messageError = false;
	const emailTest = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,6}$/;

	const validateField = (fieldName: string, value: string | string[]) => {
		let error = '';
		switch (fieldName) {
			case 'name':
				if (value.length < 2) {
					errors.name = 'Name must be at least 2 characters long';
					nameError = true;
				} else {
					errors.name = '';
					nameError = false;
				}
				break;
			case 'email':
				if (fields.email.length < 2 || emailTest.test(fields.email) === false) {
					formIsValid = false;
					errors.email = 'Please enter a valid email address.';
					emailError = true;
				} else {
					errors.email = '';
					emailError = false;
				}
				break;
			case 'phone':
				if (value.length < 10) {
					errors.phone = 'Phone must be at least 10 characters long';
					phoneError = true;
				} else {
					errors.phone = '';
					phoneError = false;
				}
				break;
			case 'message':
				if (value.length < 10) {
					errors.message = 'Message must be at least 10 characters long';
					messageError = true;
				} else {
					errors.message = '';
					messageError = false;
				}
				break;
		}
		return error;
	};

	const handleSubmit = (e) => {
		formIsValid = true;

		if (fields.name.length < 2) {
			formIsValid = false;
			errors.name = 'Please enter your name.';
			nameError = true;
		} else {
			errors.name = '';
			nameError = false;
		}
		if (fields.phone.length < 10) {
			formIsValid = false;
			errors.phone = 'Please enter a valid phone number.';
			phoneError = true;
		} else {
			errors.phone = '';
			phoneError = false;
		}

		if (emailTest.test(fields.email) === false) {
			formIsValid = false;
			errors.email = 'Please enter a valid email address.';
			emailError = true;
		} else {
			errors.email = '';
			emailError = false;
		}

		if (fields.message.length < 10) {
			formIsValid = false;
			errors.message = 'Please tell us how we can help you.';
			messageError = true;
		} else {
			errors.message = '';
			messageError = false;
		}

		e.preventDefault();

		let myForm = document.getElementById('contact') as HTMLFormElement;
		let formData: any = new FormData(myForm);
		if (formIsValid) {
			fetch('/', {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: new URLSearchParams(formData).toString()
			})
				.then(() => {
					console.log('Form successfully submitted'), (showTYModal = true), myForm.reset();
				})
				.catch((error) => alert(error));
		}
	};
</script>

<form name="contact" id="contact" class="contactForm" data-netlify="true" method="POST">
	<input type="hidden" class="hidden" name="form-name" value="contact" />
	<!-- <input class="hidden" name="bot-field" /> -->
	<div class="formBlock">
		<input
			type="text"
			name="name"
			id="name"
			class={nameError ? 'inputError' : ''}
			required
			bind:value={fields.name}
			on:blur={() => validateField('name', fields.name)}
		/>
		<label for="name">Name</label>
		<p class="error">{errors.name}</p>
	</div>
	<div class="formBlock">
		<input
			type="tel"
			name="phone"
			id="phone"
			class={phoneError ? 'inputError' : ''}
			required
			bind:value={fields.phone}
			on:blur={() => validateField('phone', fields.phone)}
		/>
		<label for="phone">Phone</label>
		<p class="error">{errors.phone}</p>
	</div>
	<div class="formBlock">
		<input
			type="email"
			name="email"
			id="email"
			required
			class={emailError ? 'inputError' : ''}
			on:blur={() => validateField('email', fields.email)}
			bind:value={fields.email}
		/>
		<label for="email">Email</label>
		<p class="error">{errors.email}</p>
	</div>
	<div class="formBlock">
		<textarea
			name="message"
			id="message"
			class={messageError ? 'inputError' : ''}
			required
			bind:value={fields.message}
			on:blur={() => validateField('message', fields.message)}
		/>
		<label for="message">Message</label>
		<p class="error">{errors.message}</p>
	</div>
	<div class="formBlock">
		<button type="submit">Submit</button>
	</div>
</form>

<style lang="scss">
	.contactForm {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: calc(100% - 40px);
		max-width: 500px;
		margin: 30px auto;
		padding: 20px;
		border: 2px solid #111;
		border-radius: 15px;
		background: #fff;
	}
	.formBlock {
		width: 100%;
		margin-top: 20px;
		position: relative;
	}
	label {
		position: absolute;
		top: 0;
		left: 20px;
		transform: translateY(calc(20px - 50%));
		transition: all 0.3s ease-in-out;
		color: #333;
		font-weight: 500;
		pointer-events: none;
		margin: 0;
		background: #fff;
		padding: 0 10px;
	}
	input:focus ~ label,
	textarea:focus ~ label,
	input:valid ~ label,
	textarea:valid ~ label {
		transform: translateY(-6px);
		left: 20px;
		font-size: 12px;
		background: #fff;
		padding: 0 10px;
	}
	input,
	textarea {
		width: 100%;
		height: 40px;
		border-radius: 10px;
		border: 2px solid #ccc;
		padding: 0 20px;
	}
	textarea {
		height: 100px;
		padding-top: 10px;
	}
	.inputError {
		border: 2px solid #800;
	}
	.error {
		font-size: 0.9em;
		color: #880000;
		margin: 5px 0 0 10px;
	}
	.hidden {
		display: none;
	}
	button {
		width: 100%;
		height: 60px;
		border-radius: 10px;
		border: 2px solid var(--primaryColor);
		background: var(--primaryColor);
		color: var(--fontColor);
		font-weight: 500;
		font-size: clamp(22px, 3.5vw, 30px);
		cursor: pointer;
		transition: all 0.3s ease-in-out;
		&:hover {
			background: #fff;
			color: #111;
		}
	}
</style>
